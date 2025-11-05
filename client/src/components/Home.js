import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Code, Zap, ArrowRight, Search } from 'lucide-react';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [recentRooms, setRecentRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRecentRooms();
  }, []);

  const fetchRecentRooms = async () => {
    try {
      const response = await axios.get('/api/code/rooms?limit=6');
      setRecentRooms(response.data.rooms || []);
    } catch (error) {
      console.error('Error fetching recent rooms:', error);
    }
  };

  const createRoom = async () => {
    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/code/room', {
        title: 'Untitled',
        description: '',
        language: 'javascript',
        createdBy: username
      });

      navigate(`/editor/${response.data.roomId}`, {
        state: { username }
      });
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = () => {
    if (!username.trim() || !roomId.trim()) {
      alert('Please enter both username and room ID');
      return;
    }

    navigate(`/editor/${roomId}`, {
      state: { username }
    });
  };

  const joinExistingRoom = (roomId) => {
    if (!username.trim()) {
      alert('Please enter a username first');
      return;
    }

    navigate(`/editor/${roomId}`, {
      state: { username }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Code className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Collaborative Code Editor</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real-time collaborative coding with syntax highlighting, live cursors, and instant synchronization
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Create/Join */}
          <div className="space-y-6">
            {/* Username Input */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Enter Your Name</h2>
              <input
                type="text"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input mb-4"
                maxLength={20}
              />
            </div>

            {/* Create Room */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Create New Room
              </h2>
              <p className="text-gray-600 mb-4">
                Start a new collaborative coding session
              </p>
              <button
                onClick={createRoom}
                disabled={loading || !username.trim()}
                className="btn btn-primary w-full flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Create Room
                  </>
                )}
              </button>
            </div>

            {/* Join Room */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <ArrowRight className="w-5 h-5 mr-2" />
                Join Existing Room
              </h2>
              <p className="text-gray-600 mb-4">
                Enter a room ID to join an existing session
              </p>
              <input
                type="text"
                placeholder="Room ID (e.g., abc12345)"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="input mb-4"
                maxLength={8}
              />
              <button
                onClick={joinRoom}
                disabled={!username.trim() || !roomId.trim()}
                className="btn btn-secondary w-full"
              >
                Join Room
              </button>
            </div>
          </div>

          {/* Right Column - Recent Rooms */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Recent Rooms
              </h2>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>

              <div className="space-y-3">
                {recentRooms
                  .filter(room => 
                    room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    room.description.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((room) => (
                    <div
                      key={room.roomId}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => joinExistingRoom(room.roomId)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{room.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {room.description || 'No description'}
                          </p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {room.language}
                            </span>
                            <span className="ml-2">
                              {room.participants?.length || 0} participants
                            </span>
                            <span className="ml-2">
                              {new Date(room.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                
                {recentRooms.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No recent rooms found</p>
                    <p className="text-sm">Create a new room to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Features</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card p-6 text-center">
              <Code className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Monaco Editor</h3>
              <p className="text-gray-600">
                Full-featured code editor with syntax highlighting and IntelliSense
              </p>
            </div>
            <div className="card p-6 text-center">
              <Zap className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Real-time Sync</h3>
              <p className="text-gray-600">
                Instant synchronization of code changes across all participants
              </p>
            </div>
            <div className="card p-6 text-center">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Live Cursors</h3>
              <p className="text-gray-600">
                See where other users are typing with live cursor positions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;