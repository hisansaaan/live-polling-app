import React, { useState, useEffect } from 'react';
import socket from './socket';

function ChatBox({ name, role }) {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const handleMessage = ({ sender, text }) => {
      setChatLog((prev) => [...prev, { sender, text }]);
    };
    socket.on('receive-message', handleMessage);
    return () => {
      socket.off('receive-message', handleMessage);
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() === '') return;
    socket.emit('send-message', { sender: name, role, text: message });
    setMessage('');
  };

  return (
    <>
      {showChat && (
        <div style={styles.chatPopup}>
          <div style={styles.header}>
            <h3 style={styles.heading}>Chat</h3>
            <button onClick={() => setShowChat(false)} style={styles.closeButton}>×</button>
          </div>
          <div style={styles.chatLog}>
            {chatLog.map((msg, index) => {
              const isMine = msg.sender === name;
              return (
                <div key={index} style={{ ...styles.messageWrapper, justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                  <div style={{ textAlign: isMine ? 'right' : 'left' }}>
                    <div style={styles.sender}>{msg.sender}</div>
                    <div style={{
                      ...styles.bubble,
                      backgroundColor: isMine ? '#4F0DCE' : '#373737',
                      color: isMine ? 'white' : '#F2F2F2'
                    }}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={styles.inputRow}>
            <input
              type="text"
              value={message}
              placeholder="Type a message..."
              onChange={(e) => setMessage(e.target.value)}
              style={styles.input}
            />
            <button onClick={sendMessage} style={styles.sendButton}>Send</button>
          </div>
        </div>
      )}
      <button onClick={() => setShowChat(!showChat)} style={styles.chatButton}>
        {showChat ? 'Close Chat' : 'Chat'}
      </button>
    </>
  );
}

const styles = {
  chatButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#4F0DCE',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    padding: '12px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    zIndex: 1000
  },
  chatPopup: {
    position: 'fixed',
    bottom: '80px',
    right: '20px',
    width: '320px',
    maxHeight: '420px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px',
    borderBottom: '1px solid #eee'
  },
  heading: {
    fontSize: '18px',
    color: '#373737',
    margin: 0
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    color: '#373737',
    cursor: 'pointer'
  },
  chatLog: {
    flex: 1,
    padding: '10px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  messageWrapper: {
    display: 'flex',
    width: '100%'
  },
  sender: {
    fontSize: '13px',
    color: '#6E6E6E',
    marginBottom: '4px'
  },
  bubble: {
    maxWidth: '70%',
    padding: '10px 14px',
    borderRadius: '16px',
    fontSize: '15px',
    wordBreak: 'break-word'
  },
  inputRow: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #eee'
  },
  input: {
    flex: 1,
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  sendButton: {
    marginLeft: '10px',
    padding: '8px 16px',
    backgroundColor: '#4F0DCE',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default ChatBox;