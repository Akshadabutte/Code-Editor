import React from 'react';
import { X, Users, Circle } from 'lucide-react';

const Participants = ({ participants, onClose }) => {
  const getStatusColor = (joinedAt) => {
    const now = new Date();
    const joined = new Date(joinedAt);
    const diffMinutes = (now - joined) / (1000 * 60);
    
    if (diffMinutes < 5) return 'text-green-500';
    if (diffMinutes < 15) return 'text-yellow-500';
    return 'text-gray-400';
  };

  const getStatusText = (joinedAt) => {
    const now = new Date();
    const joined = new Date(joinedAt);
    const diffMinutes = Math.floor((now - joined) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just joined';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours}h ago`;
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Participants ({participants.length})
        </h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto">
        {participants.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No participants yet</p>
            <p className="text-sm">Share the room link to invite others</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {participant.username.charAt(0).toUpperCase()}
                    </div>
                    <Circle 
                      className={`w-3 h-3 absolute -bottom-1 -right-1 ${getStatusColor(participant.joinedAt)}`} 
                      fill="currentColor"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {participant.username}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getStatusText(participant.joinedAt)}
                    </p>
                  </div>
                </div>
                
                <div className="text-xs text-gray-400">
                  {participant.id.slice(0, 8)}...
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>Share the room link to invite more participants</p>
          <p className="mt-1">
            All changes are synchronized in real-time
          </p>
        </div>
      </div>
    </div>
  );
};

export default Participants; 