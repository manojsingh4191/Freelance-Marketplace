import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '../utils/api';
import useAuthStore from '../store/useAuthStore';

const SOCKET_URL = 'http://localhost:5000';

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
    // Initialize socket connection
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
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
      // Fetch persistence from API
      const fetchHistory = async () => {
        try {
          const res = await api.get(`/messages/${activeRoom.roomId}`);
          setMessages(res.data);
        } catch (err) {
          console.error('Failed to fetch history', err);
        }
      };
      fetchHistory();

      // Join socket room for real-time
      socketRef.current.emit('join_room', activeRoom.roomId);
    }
  }, [activeRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeRoom) return;

    const messageData = {
      sender: user._id,
      receiver: activeRoom.otherUser._id, 
      text: newMessage,
      roomId: activeRoom.roomId,
      expiresInSeconds: clearTimer
    };

    socketRef.current.emit('send_message', messageData);
    setNewMessage('');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex">
      {/* Sidebar - Conversations List */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">No active conversations</p>
          ) : (
            conversations.map((conv) => (
              <div 
                key={conv.roomId} 
                onClick={() => setActiveRoom(conv)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${activeRoom?.roomId === conv.roomId ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : ''}`}
              >
                <div className="font-semibold text-gray-900">{conv.otherUser.name}</div>
                <div className="text-sm text-gray-500 truncate">{conv.project.title}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="w-2/3 flex flex-col">
        {activeRoom ? (
          <>
            <div className="bg-white shadow-sm py-4 px-6 border-b border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{activeRoom.otherUser.name}</h2>
                  <p className="text-sm text-gray-500">{activeRoom.project.title}</p>
                </div>
              </div>
              <select
                value={clearTimer}
                onChange={(e) => setClearTimer(Number(e.target.value))}
                className="text-sm bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
              >
                <option value={0}>Keep Messages Forever</option>
                <option value={60}>Self-Destruct (1 Min)</option>
                <option value={3600}>Self-Destruct (1 Hour)</option>
                <option value={86400}>Self-Destruct (1 Day)</option>
              </select>
            </div>

            <div className="flex-1 bg-white p-6 overflow-y-auto flex flex-col">
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                  <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                  <p>Start the conversation!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, i) => {
                    const isMe = msg.sender === user._id;
                    return (
                      <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="bg-white border-t border-gray-200 p-4 flex gap-3 shadow-sm">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Type your message..."
              />
              <button type="submit" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md flex items-center">
                Send
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-400">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
