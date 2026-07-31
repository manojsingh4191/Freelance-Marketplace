import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, Clock, Sparkles, ChevronRight } from 'lucide-react';
import api from '../utils/api';
import useAuthStore from '../store/useAuthStore';

const SOCKET_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

const bubbleVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.94 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }
};

const sidebarVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const convVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }
};

export default function Messages() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [clearTimer, setClearTimer] = useState(0);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    socketRef.current = io(SOCKET_URL);
    socketRef.current.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });
    return () => { socketRef.current.disconnect(); };
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/messages/conversations');
      setConversations(res.data);
    } catch (err) {
      console.error('Failed to fetch conversations', err);
    }
  };

  useEffect(() => {
    if (activeRoom) {
      const fetchHistory = async () => {
        try {
          const res = await api.get(`/messages/${activeRoom.roomId}`);
          setMessages(res.data);
        } catch (err) { console.error('Failed to fetch history', err); }
      };
      fetchHistory();
      socketRef.current.emit('join_room', activeRoom.roomId);
    }
  }, [activeRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeRoom) return;
    socketRef.current.emit('send_message', {
      sender: user._id,
      receiver: activeRoom.otherUser._id,
      text: newMessage,
      roomId: activeRoom.roomId,
      expiresInSeconds: clearTimer
    });
    setNewMessage('');
  };

  // ─── Inline Styles ───────────────────────────────────────────────

  const wrapperStyle = {
    height: 'calc(100vh - 72px)',
    display: 'flex',
    gap: '16px',
    padding: '16px',
    background: 'var(--bg-primary)',
    overflow: 'hidden',
  };

  const panelBase = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '20px',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: 'var(--shadow-card)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };

  const sidebarStyle = {
    ...panelBase,
    width: '300px',
    flexShrink: 0,
  };

  const chatAreaStyle = {
    ...panelBase,
    flex: 1,
  };

  return (
    <div style={wrapperStyle}>
      {/* ─── LEFT SIDEBAR ─── */}
      <div style={sidebarStyle}>
        {/* Sidebar Header */}
        <div style={{
          padding: '20px 18px 16px',
          borderBottom: '1px solid var(--border-color)',
          background: 'rgba(168,85,247,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(124,58,237,0.4)',
            }}>
              <MessageSquare size={16} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Messages
              </h2>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Conversation List */}
        <motion.div
          variants={sidebarVariants} initial="hidden" animate="visible"
          style={{ flex: 1, overflowY: 'auto', padding: '8px' }}
        >
          {conversations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <MessageSquare size={36} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
              <p style={{ fontSize: '13px' }}>No active conversations yet.</p>
              <p style={{ fontSize: '12px', marginTop: '4px' }}>Accept a proposal to start chatting.</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = activeRoom?.roomId === conv.roomId;
              return (
                <motion.div
                  key={conv.roomId}
                  variants={convVariants}
                  whileHover={{ scale: 1.02, x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveRoom(conv)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(168,85,247,0.12))'
                      : 'transparent',
                    border: isActive
                      ? '1px solid rgba(168,85,247,0.35)'
                      : '1px solid transparent',
                    boxShadow: isActive ? '0 4px 16px rgba(124,58,237,0.2)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                    background: isActive
                      ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
                      : 'linear-gradient(135deg, #374151, #4b5563)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: isActive ? '0 4px 12px rgba(124,58,237,0.4)' : 'none',
                    fontSize: '16px', fontWeight: 800, color: 'white',
                    transition: 'all 0.2s ease',
                  }}>
                    {conv.otherUser.name[0].toUpperCase()}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '13px', fontWeight: 700,
                      color: isActive ? 'var(--accent)' : 'var(--text-primary)',
                      marginBottom: '2px', transition: 'color 0.2s',
                    }}>
                      {conv.otherUser.name}
                    </div>
                    <div style={{
                      fontSize: '11px', color: 'var(--text-muted)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {conv.project.title}
                    </div>
                  </div>

                  {isActive && (
                    <ChevronRight size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  )}
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>

      {/* ─── MAIN CHAT AREA ─── */}
      <div style={chatAreaStyle}>
        {activeRoom ? (
          <>
            {/* Chat Header */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid var(--border-color)',
              background: 'rgba(168,85,247,0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
                  fontSize: '18px', fontWeight: 800, color: 'white',
                }}>
                  {activeRoom.otherUser.name[0].toUpperCase()}
                </div>
                <div>
                  <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    {activeRoom.otherUser.name}
                  </h2>
                  <p style={{ fontSize: '12px', color: 'var(--accent)', margin: 0, fontWeight: 600 }}>
                    {activeRoom.project.title}
                  </p>
                </div>
              </div>

              {/* Self-Destruct Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={13} style={{ color: 'var(--text-muted)' }} />
                <select
                  value={clearTimer}
                  onChange={(e) => setClearTimer(Number(e.target.value))}
                  style={{
                    fontSize: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                    borderRadius: '8px', padding: '5px 10px', color: 'var(--text-secondary)',
                    outline: 'none', cursor: 'pointer',
                  }}
                >
                  <option value={0}>Keep Forever</option>
                  <option value={60}>Self-Destruct (1 Min)</option>
                  <option value={3600}>Self-Destruct (1 Hour)</option>
                  <option value={86400}>Self-Destruct (1 Day)</option>
                </select>
              </div>
            </div>

            {/* Messages Area */}
            <div style={{
              flex: 1, overflowY: 'auto',
              padding: '24px',
              display: 'flex', flexDirection: 'column', gap: '10px',
            }}>
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}
                >
                  <div style={{
                    width: '72px', height: '72px', borderRadius: '50%',
                    background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
                  }}>
                    <Sparkles size={28} style={{ color: 'var(--accent)' }} />
                  </div>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Start the conversation!
                  </p>
                  <p style={{ fontSize: '13px' }}>Send the first message to {activeRoom.otherUser.name}.</p>
                </motion.div>
              ) : (
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => {
                    const isMe = msg.sender === user._id;
                    return (
                      <motion.div
                        key={msg._id || i}
                        variants={bubbleVariants}
                        initial="hidden"
                        animate="visible"
                        style={{
                          display: 'flex',
                          justifyContent: isMe ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <div style={{
                          maxWidth: '68%',
                          padding: '10px 16px',
                          borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                          fontSize: '14px',
                          lineHeight: 1.5,
                          wordBreak: 'break-word',
                          ...(isMe ? {
                            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                            color: 'white',
                            boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
                          } : {
                            background: 'var(--bg-card-hover)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-color)',
                            backdropFilter: 'blur(12px)',
                          }),
                        }}>
                          {msg.text}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* ─── Floating Input Bar ─── */}
            <div style={{ padding: '12px 16px', flexShrink: 0 }}>
              <form
                onSubmit={handleSendMessage}
                style={{
                  display: 'flex', gap: '10px', alignItems: 'center',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '999px',
                  padding: '8px 8px 8px 20px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message ${activeRoom.otherUser.name}...`}
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    fontSize: '14px', color: 'var(--text-primary)',
                  }}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  disabled={!newMessage.trim()}
                  style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: newMessage.trim()
                      ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
                      : 'rgba(255,255,255,0.1)',
                    border: 'none', cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: newMessage.trim() ? '0 4px 16px rgba(124,58,237,0.5)' : 'none',
                    transition: 'all 0.2s ease', flexShrink: 0,
                  }}
                >
                  <Send size={16} color={newMessage.trim() ? 'white' : 'var(--text-muted)'} />
                </motion.button>
              </form>
            </div>
          </>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}
          >
            <div style={{
              width: '88px', height: '88px', borderRadius: '24px', marginBottom: '20px',
              background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(236,72,153,0.1))',
              border: '1px solid rgba(168,85,247,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MessageSquare size={36} style={{ color: 'var(--accent)', opacity: 0.7 }} />
            </div>
            <p style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Your Messages
            </p>
            <p style={{ fontSize: '13px', textAlign: 'center', maxWidth: '280px', lineHeight: 1.6 }}>
              Select a conversation from the sidebar to start chatting with your client or freelancer.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
