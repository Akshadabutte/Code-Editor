const express = require('express');
const router = express.Router();
const Code = require('../models/Code');
const { v4: uuidv4 } = require('uuid');

// Create a new room
router.post('/room', async (req, res) => {
  try {
    const { title, description, language, createdBy } = req.body;
    const roomId = uuidv4().substring(0, 8);
    
    const newRoom = new Code({
      roomId,
      title: title || 'Untitled',
      description: description || '',
      language: language || 'javascript',
      createdBy: createdBy || 'Anonymous'
    });

    await newRoom.save();
    
    res.status(201).json({
      success: true,
      roomId,
      room: newRoom
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create room'
    });
  }
});

// Get room by ID
router.get('/room/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Code.findOne({ roomId });
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    res.json({
      success: true,
      room
    });
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch room'
    });
  }
});

// Update room code
router.put('/room/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { code, language, title, description } = req.body;
    
    const room = await Code.findOne({ roomId });
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    // Update fields if provided
    if (code !== undefined) room.code = code;
    if (language !== undefined) room.language = language;
    if (title !== undefined) room.title = title;
    if (description !== undefined) room.description = description;
    
    await room.save();
    
    res.json({
      success: true,
      room
    });
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update room'
    });
  }
});

// Get all public rooms
router.get('/rooms', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = { isPublic: true };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const rooms = await Code.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('roomId title description language createdAt updatedAt participants');
    
    const total = await Code.countDocuments(query);
    
    res.json({
      success: true,
      rooms,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rooms'
    });
  }
});

// Delete room
router.delete('/room/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Code.findOneAndDelete({ roomId });
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete room'
    });
  }
});

// Add participant to room
router.post('/room/:roomId/participant', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId, username } = req.body;
    
    const room = await Code.findOne({ roomId });
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    // Check if participant already exists
    const existingParticipant = room.participants.find(p => p.userId === userId);
    
    if (!existingParticipant) {
      room.participants.push({
        userId,
        username,
        joinedAt: new Date()
      });
      await room.save();
    }
    
    res.json({
      success: true,
      participants: room.participants
    });
  } catch (error) {
    console.error('Error adding participant:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add participant'
    });
  }
});

// Remove participant from room
router.delete('/room/:roomId/participant/:userId', async (req, res) => {
  try {
    const { roomId, userId } = req.params;
    
    const room = await Code.findOne({ roomId });
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    room.participants = room.participants.filter(p => p.userId !== userId);
    await room.save();
    
    res.json({
      success: true,
      participants: room.participants
    });
  } catch (error) {
    console.error('Error removing participant:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove participant'
    });
  }
});

module.exports = router; 