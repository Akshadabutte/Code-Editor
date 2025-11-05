const Code = require('../models/Code');

const rooms = new Map(); // In-memory room state for active sessions

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a room
    socket.on('join-room', async (data) => {
      const { roomId, username } = data;
      const userId = socket.id;

      try {
        // Find or create room in database
        let room = await Code.findOne({ roomId });
        
        if (!room) {
          // Create new room if it doesn't exist
          room = new Code({
            roomId,
            title: 'Untitled',
            language: 'javascript',
            createdBy: username || 'Anonymous'
          });
          await room.save();
        }

        // Join socket room
        socket.join(roomId);
        
        // Add user to in-memory room state
        if (!rooms.has(roomId)) {
          rooms.set(roomId, {
            code: room.code,
            language: room.language,
            participants: new Map(),
            cursors: new Map()
          });
        }

        const roomState = rooms.get(roomId);
        roomState.participants.set(userId, {
          id: userId,
          username: username || 'Anonymous',
          joinedAt: new Date()
        });

        // Add participant to database
        const existingParticipant = room.participants.find(p => p.userId === userId);
        if (!existingParticipant) {
          room.participants.push({
            userId,
            username: username || 'Anonymous',
            joinedAt: new Date()
          });
          await room.save();
        }

        // Send current room state to the joining user
        socket.emit('room-joined', {
          roomId,
          code: roomState.code,
          language: roomState.language,
          participants: Array.from(roomState.participants.values()),
          cursors: Array.from(roomState.cursors.values())
        });

        // Notify other users in the room
        socket.to(roomId).emit('user-joined', {
          userId,
          username: username || 'Anonymous',
          participants: Array.from(roomState.participants.values())
        });

        console.log(`User ${username} joined room ${roomId}`);
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Handle code changes
    socket.on('code-change', async (data) => {
      const { roomId, code, language } = data;
      const userId = socket.id;

      try {
        // Update in-memory state
        if (rooms.has(roomId)) {
          const roomState = rooms.get(roomId);
          roomState.code = code;
          if (language) roomState.language = language;
        }

        // Broadcast to other users in the room
        socket.to(roomId).emit('code-updated', {
          code,
          language,
          userId
        });

        // Save to database periodically (debounced)
        clearTimeout(rooms.get(roomId)?.saveTimeout);
        if (rooms.has(roomId)) {
          rooms.get(roomId).saveTimeout = setTimeout(async () => {
            try {
              await Code.findOneAndUpdate(
                { roomId },
                { code, language, updatedAt: new Date() }
              );
            } catch (error) {
              console.error('Error saving code to database:', error);
            }
          }, 1000); // Save after 1 second of inactivity
        }
      } catch (error) {
        console.error('Error handling code change:', error);
      }
    });

    // Handle cursor position updates
    socket.on('cursor-change', (data) => {
      const { roomId, position, selection } = data;
      const userId = socket.id;

      if (rooms.has(roomId)) {
        const roomState = rooms.get(roomId);
        roomState.cursors.set(userId, {
          userId,
          position,
          selection,
          timestamp: Date.now()
        });

        // Broadcast cursor position to other users
        socket.to(roomId).emit('cursor-updated', {
          userId,
          position,
          selection
        });
      }
    });

    // Handle chat messages
    socket.on('chat-message', (data) => {
      const { roomId, message, username } = data;
      const userId = socket.id;

      // Broadcast message to all users in the room
      io.to(roomId).emit('chat-message', {
        userId,
        username: username || 'Anonymous',
        message,
        timestamp: new Date()
      });
    });

    // Handle user typing indicator
    socket.on('typing', (data) => {
      const { roomId, isTyping } = data;
      const userId = socket.id;

      socket.to(roomId).emit('user-typing', {
        userId,
        isTyping
      });
    });

    // Handle language change
    socket.on('language-change', async (data) => {
      const { roomId, language } = data;

      try {
        // Update in-memory state
        if (rooms.has(roomId)) {
          rooms.get(roomId).language = language;
        }

        // Broadcast to all users in the room
        io.to(roomId).emit('language-updated', {
          language,
          userId: socket.id
        });

        // Save to database
        await Code.findOneAndUpdate(
          { roomId },
          { language, updatedAt: new Date() }
        );
      } catch (error) {
        console.error('Error handling language change:', error);
      }
    });

    // Handle room title/description updates
    socket.on('room-update', async (data) => {
      const { roomId, title, description } = data;

      try {
        // Broadcast to all users in the room
        io.to(roomId).emit('room-updated', {
          title,
          description,
          userId: socket.id
        });

        // Save to database
        await Code.findOneAndUpdate(
          { roomId },
          { title, description, updatedAt: new Date() }
        );
      } catch (error) {
        console.error('Error handling room update:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      const userId = socket.id;
      console.log(`User disconnected: ${userId}`);

      // Remove user from all rooms they were in
      for (const [roomId, roomState] of rooms.entries()) {
        if (roomState.participants.has(userId)) {
          roomState.participants.delete(userId);
          roomState.cursors.delete(userId);

          // Notify other users
          socket.to(roomId).emit('user-left', {
            userId,
            participants: Array.from(roomState.participants.values())
          });

          // Remove participant from database
          try {
            const room = await Code.findOne({ roomId });
            if (room) {
              room.participants = room.participants.filter(p => p.userId !== userId);
              await room.save();
            }
          } catch (error) {
            console.error('Error removing participant from database:', error);
          }

          // Clean up empty rooms
          if (roomState.participants.size === 0) {
            rooms.delete(roomId);
          }
        }
      }
    });

    // Handle room leave
    socket.on('leave-room', async (data) => {
      const { roomId } = data;
      const userId = socket.id;

      socket.leave(roomId);

      if (rooms.has(roomId)) {
        const roomState = rooms.get(roomId);
        roomState.participants.delete(userId);
        roomState.cursors.delete(userId);

        // Notify other users
        socket.to(roomId).emit('user-left', {
          userId,
          participants: Array.from(roomState.participants.values())
        });

        // Remove participant from database
        try {
          const room = await Code.findOne({ roomId });
          if (room) {
            room.participants = room.participants.filter(p => p.userId !== userId);
            await room.save();
          }
        } catch (error) {
          console.error('Error removing participant from database:', error);
        }

        // Clean up empty rooms
        if (roomState.participants.size === 0) {
          rooms.delete(roomId);
        }
      }
    });
  });

  return io;
};

module.exports = socketHandler; 