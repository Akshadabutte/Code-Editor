import React, { useState, useEffect } from 'react';

const Editor = () => {
  // State for overlay panels
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [participants, setParticipants] = useState([
    { id: 1, name: 'Akshada (You)', avatar: 'A', activity: 'Editing line 8', online: true, color: '#4285f4' },
    { id: 2, name: 'Guest_User', avatar: 'G', activity: 'Viewing code', online: true, color: '#ea4335' },
    { id: 3, name: 'John Doe', avatar: 'J', activity: 'Offline • 5 min ago', online: false, color: '#9c27b0' }
  ]);
  
  const [messages, setMessages] = useState([
    { id: 1, name: 'Akshada', avatar: 'A', time: '2:30 PM', content: "Let's work on this Java program together!" },
    { id: 2, name: 'Guest_User', avatar: 'G', time: '2:32 PM', content: 'Great! The syntax looks correct.' }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [code, setCode] = useState(`class Addition {
    public static void main(String[] args) {
        System.out.println("Hello, My name is Akshada");
        
        // Let's add some more functionality
        int a = 10;
        int b = 20;
        int sum = a + b;
        
        System.out.println("Sum of " + a + " and " + b + " is: " + sum);
    }
}`);

  const toggleOverlay = (type) => {
    setActiveOverlay(activeOverlay === type ? null : type);
  };

  const closeOverlay = () => {
    setActiveOverlay(null);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      const message = {
        id: messages.length + 1,
        name: 'Akshada (You)',
        avatar: 'A',
        time: currentTime,
        content: newMessage
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Close overlay when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeOverlay && !e.target.closest('.overlay-panel') && !e.target.closest('.sidebar-button')) {
        setActiveOverlay(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeOverlay]);

  const styles = {
    collaborativeEditor: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#1e1e1e',
      color: '#cccccc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      background: '#2d2d2d',
      padding: '8px 16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #404040',
      minHeight: '35px'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '14px',
      fontWeight: '500'
    },
    statusBadge: {
      background: '#0d7377',
      padding: '2px 8px',
      borderRadius: '8px',
      fontSize: '11px',
      color: 'white'
    },
    editorContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    },
    sidebarButtons: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      display: 'flex',
      gap: '8px',
      zIndex: 100
    },
    sidebarButton: {
      padding: '8px 12px',
      background: '#2d2d2d',
      border: '1px solid #404040',
      borderRadius: '6px',
      color: '#cccccc',
      cursor: 'pointer',
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.2s ease'
    },
    sidebarButtonActive: {
      background: '#4285f4',
      borderColor: '#4285f4',
      color: 'white'
    },
    codeEditor: {
      flex: 1,
      background: '#1e1e1e',
      color: '#d4d4d4',
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
      fontSize: '13px',
      lineHeight: '1.6',
      padding: '50px 16px 16px 16px',
      border: 'none',
      outline: 'none',
      resize: 'none',
      whiteSpace: 'pre'
    },
    overlayPanel: {
      position: 'fixed',
      top: 0,
      right: 0,
      width: '50%',
      height: '100vh',
      background: '#252526',
      borderLeft: '1px solid #404040',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 200,
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease'
    },
    overlayPanelActive: {
      transform: 'translateX(0)'
    },
    overlayHeader: {
      padding: '12px 16px',
      background: '#2d2d2d',
      borderBottom: '1px solid #404040',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    overlayTitle: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#fff'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: '#888',
      cursor: 'pointer',
      fontSize: '18px',
      padding: '4px',
      borderRadius: '3px',
      transition: 'color 0.2s ease'
    },
    participantsList: {
      flex: 1,
      padding: '8px',
      overflowY: 'auto'
    },
    participant: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 12px',
      marginBottom: '4px',
      borderRadius: '6px',
      transition: 'background 0.2s ease'
    },
    participantAvatar: {
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      color: 'white',
      fontSize: '12px',
      position: 'relative'
    },
    participantInfo: {
      flex: 1
    },
    participantName: {
      fontSize: '13px',
      fontWeight: '500',
      marginBottom: '2px'
    },
    participantActivity: {
      fontSize: '11px',
      color: '#888'
    },
    chatMessages: {
      flex: 1,
      padding: '8px 12px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    chatMessage: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    messageHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    messageAvatar: {
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      color: 'white',
      fontSize: '10px'
    },
    messageName: {
      fontSize: '12px',
      fontWeight: '500'
    },
    messageTime: {
      fontSize: '10px',
      color: '#888'
    },
    messageContent: {
      marginLeft: '28px',
      fontSize: '12px',
      lineHeight: '1.4',
      background: '#2d2d2d',
      padding: '6px 10px',
      borderRadius: '8px',
      borderLeft: '3px solid #4285f4'
    },
    chatInputContainer: {
      borderTop: '1px solid #404040',
      padding: '12px',
      background: '#2d2d2d'
    },
    chatInputWrapper: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center'
    },
    chatInput: {
      flex: 1,
      background: '#1e1e1e',
      border: '1px solid #555',
      borderRadius: '16px',
      padding: '6px 12px',
      color: '#fff',
      fontSize: '12px',
      outline: 'none'
    },
    sendButton: {
      background: '#4285f4',
      border: 'none',
      borderRadius: '50%',
      width: '28px',
      height: '28px',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      transition: 'background 0.2s ease'
    }
  };

  return (
    <div style={styles.collaborativeEditor}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <span style={{ color: '#4285f4', fontWeight: 'bold', fontSize: '16px', marginRight: '6px' }}>
            &lt;/&gt;
          </span>
          Collaborative Code Editor
        </div>
        <div style={styles.statusBadge}>Live</div>
      </div>

      {/* Main Editor Container */}
      <div style={styles.editorContainer}>
        {/* Floating Buttons */}
        <div style={styles.sidebarButtons}>
          <button 
            className="sidebar-button"
            style={{
              ...styles.sidebarButton,
              ...(activeOverlay === 'participants' ? styles.sidebarButtonActive : {})
            }}
            onClick={() => toggleOverlay('participants')}
          >
            👥 Members ({participants.filter(p => p.online).length})
          </button>
          <button 
            className="sidebar-button"
            style={{
              ...styles.sidebarButton,
              ...(activeOverlay === 'chat' ? styles.sidebarButtonActive : {})
            }}
            onClick={() => toggleOverlay('chat')}
          >
            💬 Chat
          </button>
        </div>

        {/* Code Editor */}
        <textarea 
          style={styles.codeEditor}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          placeholder="Start coding..."
        />
      </div>

      {/* Participants Overlay */}
      <div 
        className="overlay-panel"
        style={{
          ...styles.overlayPanel,
          ...(activeOverlay === 'participants' ? styles.overlayPanelActive : {})
        }}
      >
        <div style={styles.overlayHeader}>
          <div style={styles.overlayTitle}>👥 Active Members</div>
          <button 
            style={styles.closeButton}
            onClick={closeOverlay}
            onMouseEnter={(e) => {
              e.target.style.color = '#fff';
              e.target.style.background = '#404040';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#888';
              e.target.style.background = 'none';
            }}
          >
            ×
          </button>
        </div>
        <div style={styles.participantsList}>
          {participants.map(participant => (
            <div 
              key={participant.id} 
              style={styles.participant}
              onMouseEnter={(e) => e.target.style.background = '#2d2d2d'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              <div 
                style={{
                  ...styles.participantAvatar,
                  background: participant.color,
                  ...(participant.online ? {
                    '::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: '8px',
                      height: '8px',
                      background: '#0f9d58',
                      border: '1.5px solid #252526',
                      borderRadius: '50%'
                    }
                  } : {})
                }}
              >
                {participant.avatar}
                {participant.online && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '8px',
                    height: '8px',
                    background: '#0f9d58',
                    border: '1.5px solid #252526',
                    borderRadius: '50%'
                  }} />
                )}
              </div>
              <div style={styles.participantInfo}>
                <div style={styles.participantName}>{participant.name}</div>
                <div style={styles.participantActivity}>{participant.activity}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Overlay */}
      <div 
        className="overlay-panel"
        style={{
          ...styles.overlayPanel,
          ...(activeOverlay === 'chat' ? styles.overlayPanelActive : {})
        }}
      >
        <div style={styles.overlayHeader}>
          <div style={styles.overlayTitle}>💬 Team Chat</div>
          <button 
            style={styles.closeButton}
            onClick={closeOverlay}
            onMouseEnter={(e) => {
              e.target.style.color = '#fff';
              e.target.style.background = '#404040';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#888';
              e.target.style.background = 'none';
            }}
          >
            ×
          </button>
        </div>
        <div style={styles.chatMessages}>
          {messages.map(message => (
            <div key={message.id} style={styles.chatMessage}>
              <div style={styles.messageHeader}>
                <div style={{...styles.messageAvatar, background: '#4285f4'}}>
                  {message.avatar}
                </div>
                <div style={styles.messageName}>{message.name}</div>
                <div style={styles.messageTime}>{message.time}</div>
              </div>
              <div style={styles.messageContent}>{message.content}</div>
            </div>
          ))}
        </div>
        <div style={styles.chatInputContainer}>
          <div style={styles.chatInputWrapper}>
            <input 
              type="text"
              style={styles.chatInput}
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={(e) => e.target.style.borderColor = '#4285f4'}
              onBlur={(e) => e.target.style.borderColor = '#555'}
            />
            <button 
              style={styles.sendButton}
              onClick={sendMessage}
              onMouseEnter={(e) => e.target.style.background = '#3367d6'}
              onMouseLeave={(e) => e.target.style.background = '#4285f4'}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;