import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Search, Plus, Users, Phone, Video, MoreVertical } from 'lucide-react';
import { useSocket } from '../hooks/useSocket';
import { apiService } from '../services/api';
import { supabase } from '../lib/supabase';

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  
  const socket = useSocket();

  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);
        
        // Load chat rooms
        const roomsData = await apiService.getChatRooms();
        setChatRooms(roomsData.rooms || []);
        
        setLoading(false);
      } catch (error) {
        console.error('Error initializing chat:', error);
        setLoading(false);
      }
    };

    initializeChat();
  }, []);

  useEffect(() => {
    if (socket) {
      // Listen for new messages
      socket.on('new_message', (message: any) => {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      });

      // Listen for typing indicators
      socket.on('user_typing', ({ userId, typing }: { userId: string; typing: boolean }) => {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          if (typing) {
            newSet.add(userId);
          } else {
            newSet.delete(userId);
          }
          return newSet;
        });
      });

      return () => {
        socket.off('new_message');
        socket.off('user_typing');
      };
    }
  }, [socket]);

  useEffect(() => {
    if (selectedChat && chatRooms.length > 0) {
      loadMessages(selectedChat);
      if (socket) {
        socket.emit('join_room', selectedChat);
      }
    }
  }, [selectedChat, socket, chatRooms]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async (roomId: string | number) => {
    try {
      const messagesData = await apiService.getRoomMessages(roomId.toString());
      setMessages(messagesData.messages || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const selectedChatRoom = chatRooms.find(room => room._id === selectedChat || room.id === selectedChat);
  const filteredChats = chatRooms.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      socket.emit('send_message', {
        roomId: selectedChat,
        content: newMessage.trim(),
        type: 'text'
      });
      setNewMessage('');
      
      // Stop typing indicator
      socket.emit('typing_stop', selectedChat);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleTyping = () => {
    if (socket && selectedChat) {
      socket.emit('typing_start', selectedChat);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing_stop', selectedChat);
      }, 1000);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getLastMessageTime = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`;
    return messageTime.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex h-screen">
          {/* Chat List Sidebar */}
          <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                <button className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors">
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {filteredChats.map((chat) => (
                <div
                  key={chat._id || chat.id}
                  onClick={() => setSelectedChat(chat._id || chat.id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedChat === (chat._id || chat.id) ? 'bg-purple-50 border-purple-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={chat.avatar || `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=100`}
                        alt={chat.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {chat.type === 'direct' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                      )}
                      {chat.type === 'group' && (
                        <div className="absolute bottom-0 right-0 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          <Users className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {chat.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {chat.lastActivity ? getLastMessageTime(chat.lastActivity) : 'No messages'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {messages.length > 0 ? messages[messages.length - 1]?.content : 'No messages yet'}
                      </p>
                      {chat.type === 'group' && (
                        <p className="text-xs text-gray-500">{chat.participants?.length || 0} members</p>
                      )}
                    </div>
                    
                    {chat.unreadCount && chat.unreadCount > 0 && (
                      <div className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedChatRoom ? (
              <>
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedChatRoom.avatar}
                        alt={selectedChatRoom.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          {selectedChatRoom.name}
                        </h2>
                        {selectedChatRoom.type === 'group' ? (
                          <p className="text-sm text-gray-500">{selectedChatRoom.participants?.length || 0} members</p>
                        ) : (
                          <p className="text-sm text-gray-500">Online</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                        <Phone className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                        <Video className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${message.senderId._id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${message.senderId._id === user?.id ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {message.senderId._id !== user?.id && (
                          <img
                            src={message.senderId.avatar || `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=100`}
                            alt={`${message.senderId.firstName} ${message.senderId.lastName}`}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <div>
                          {message.senderId._id !== user?.id && (
                            <p className="text-xs text-gray-500 mb-1 px-3">
                              {message.senderId.firstName} {message.senderId.lastName}
                            </p>
                          )}
                          <div
                            className={`px-4 py-2 rounded-lg ${
                              message.senderId._id === user?.id
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 px-3">
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing indicators */}
                  {typingUsers.size > 0 && (
                    <div className="flex justify-start">
                      <div className="bg-gray-200 px-4 py-2 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="bg-white border-t border-gray-200 p-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onInput={handleTyping}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600">Choose a chat from the sidebar to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;