import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Search, Settings, Bell, Send, X } from 'lucide-react';
import PlacementSidebar from './placement_sidebar';

const PlacementChat = ({ userName = "Prashant.S.Rana" }) => {
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    socketRef.current = io('http://localhost:5001', {
      transports: ['websocket'],
      reconnection: true
    });

    socketRef.current.on('connect', () => console.log('✅ Connected'));
    socketRef.current.on('disconnect', () => console.log('👋 Disconnected'));

    socketRef.current.on('new_message', (messageData) => {
      setMessages((prev) => [...prev, {
        ...messageData,
        isUser: messageData.senderId === currentUser?.id
      }]);
    });

    socketRef.current.on('user_typing', ({ userId, isTyping: typing }) => {
      if (userId !== currentUser?.id) setIsTyping(typing);
    });

    return () => socketRef.current?.disconnect();
  }, [currentUser]);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5001/api/user', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setCurrentUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5001/api/conversations', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setConversations(data.conversations || []);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };
    fetchConversations();
  }, []);

  // Handle conversation selection
  useEffect(() => {
    if (!selectedChat || !socketRef.current) return;

    const token = localStorage.getItem('authToken');
    socketRef.current.emit('join_conversation', {
      conversationId: selectedChat.id,
      token: token
    });

    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/conversations/${selectedChat.id}/messages`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setMessages(data.messages || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();

    return () => {
      socketRef.current?.emit('leave_conversation', { conversationId: selectedChat.id });
    };
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat || !socketRef.current) return;

    socketRef.current.emit('send_message', {
      conversationId: selectedChat.id,
      content: message,
      token: localStorage.getItem('authToken')
    });

    setMessage('');
  };

  const handleTyping = (isTyping) => {
    if (!selectedChat || !socketRef.current) return;
    socketRef.current.emit('typing', {
      conversationId: selectedChat.id,
      token: localStorage.getItem('authToken'),
      isTyping: isTyping
    });
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    handleTyping(true);
    typingTimeoutRef.current = setTimeout(() => handleTyping(false), 2000);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:5001/api/chat/search-users?q=${encodeURIComponent(query)}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setSearchResults(data.users || []);
        setShowSearchResults(true);
      } catch (error) {
        console.error('Error searching users:', error);
      }
    }, 300);
  };

  const handleStartChat = async (user) => {
    try {
      const token = localStorage.getItem('authToken');
      
      // Create or get existing conversation
      const response = await fetch('http://localhost:5001/api/conversations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ otherUserId: user.id })
      });
      
      const data = await response.json();
      
      // Refresh conversations
      const convResponse = await fetch('http://localhost:5001/api/conversations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const convData = await convResponse.json();
      setConversations(convData.conversations || []);
      
      // Find and select the conversation
      const newConv = convData.conversations.find(c => c.otherUserId === user.id);
      if (newConv) {
        setSelectedChat(newConv);
      }
      
      // Clear search
      setSearchQuery('');
      setSearchResults([]);
      setShowSearchResults(false);
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <PlacementSidebar />
      
      <div className="flex-1 bg-white flex ml-64">
        {/* Chat List Sidebar */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">All Messages</h2>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search users..."
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowSearchResults(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto z-10">
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleStartChat(user)}
                      className="w-full p-3 hover:bg-gray-50 text-left border-b last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium">{user.name.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{user.name}</h3>
                          <p className="text-xs text-gray-500">{user.userType}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {showSearchResults && searchResults.length === 0 && searchQuery.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
                  <p className="text-sm text-gray-500 text-center">No users found</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedChat(conv)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                  selectedChat?.id === conv.id ? 'bg-gray-50' : ''
                }`}
              >
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 font-medium">{conv.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 truncate">{conv.name}</h3>
                    <span className="text-xs text-gray-500 ml-2">{conv.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 truncate">{conv.preview}</p>
                    {conv.unread > 0 && (
                      <span className="ml-2 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium">{selectedChat.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{selectedChat.name}</h2>
                    {isTyping && <p className="text-xs text-gray-500">typing...</p>}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Settings size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                    <Bell size={20} className="text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                  <button className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-3 py-2">
                    <span className="font-medium text-gray-700">{currentUser?.name || userName}</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto space-y-4">
                  <div className="text-center text-sm text-gray-500 mb-6">Today</div>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-3 ${
                        msg.isUser ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-600 font-medium">{msg.sender.charAt(0)}</span>
                      </div>
                      <div className={`flex flex-col ${msg.isUser ? 'items-end' : ''}`}>
                        <div
                          className={`max-w-lg p-4 rounded-lg ${
                            msg.isUser
                              ? 'bg-blue-500 text-white'
                              : 'bg-white border border-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 p-4">
                <div className="max-w-4xl mx-auto flex items-center gap-3">
                  <input
                    type="text"
                    value={message}
                    onChange={handleMessageChange}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Write your message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
                  >
                    <span>Send</span>
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlacementChat;