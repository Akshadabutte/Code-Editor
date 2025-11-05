import React, { useState } from 'react';
import { X, Code, Edit3, Globe } from 'lucide-react';
import axios from 'axios';

const Sidebar = ({ language, onLanguageChange, roomInfo, onClose }) => {
  const [title, setTitle] = useState(roomInfo?.title || '');
  const [description, setDescription] = useState(roomInfo?.description || '');
  const [isSaving, setIsSaving] = useState(false);

  const languages = [
    { id: 'javascript', name: 'JavaScript', icon: '⚡' },
    { id: 'typescript', name: 'TypeScript', icon: '📘' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'java', name: 'Java', icon: '☕' },
    { id: 'cpp', name: 'C++', icon: '⚙️' },
    { id: 'c', name: 'C', icon: '🔧' },
    { id: 'html', name: 'HTML', icon: '🌐' },
    { id: 'css', name: 'CSS', icon: '🎨' },
    { id: 'json', name: 'JSON', icon: '📄' },
    { id: 'xml', name: 'XML', icon: '📋' },
    { id: 'sql', name: 'SQL', icon: '🗄️' },
    { id: 'php', name: 'PHP', icon: '🐘' },
    { id: 'go', name: 'Go', icon: '🐹' },
    { id: 'rust', name: 'Rust', icon: '🦀' },
    { id: 'swift', name: 'Swift', icon: '🍎' },
    { id: 'kotlin', name: 'Kotlin', icon: '📱' },
  ];

  const handleSaveRoomInfo = async () => {
    if (!roomInfo?.roomId) return;
    
    setIsSaving(true);
    try {
      await axios.put(`/api/code/room/${roomInfo.roomId}`, {
        title,
        description
      });
    } catch (error) {
      console.error('Error saving room info:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Settings</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Language Selection */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <Code className="w-4 h-4 mr-2" />
            Programming Language
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => onLanguageChange(lang.id)}
                className={`p-3 text-left rounded-lg border transition-colors ${
                  language === lang.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-lg mr-2">{lang.icon}</span>
                  <span className="text-sm font-medium">{lang.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Room Information */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <Edit3 className="w-4 h-4 mr-2" />
            Room Information
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Room Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input text-sm"
                placeholder="Enter room title"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input text-sm resize-none"
                rows={3}
                placeholder="Enter room description"
              />
            </div>
            
            <button
              onClick={handleSaveRoomInfo}
              disabled={isSaving}
              className="btn btn-primary w-full text-sm"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Room Details */}
        {roomInfo && (
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              Room Details
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Room ID:</span>
                <span className="font-mono text-gray-900">{roomInfo.roomId}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="text-gray-900">
                  {new Date(roomInfo.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="text-gray-900">
                  {new Date(roomInfo.updatedAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Created By:</span>
                <span className="text-gray-900">{roomInfo.createdBy}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Participants:</span>
                <span className="text-gray-900">{roomInfo.participants?.length || 0}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 