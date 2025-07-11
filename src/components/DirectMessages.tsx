import React, { useState } from 'react';
import { Search, Send, ArrowLeft, MoreVertical, Phone, Video, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Chat {
  id: string;
  user: {
    name: string;
    avatar: string;
    isOnline: boolean;
  };
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: Message[];
}

interface DirectMessagesProps {
  isOpen: boolean;
  onClose: () => void;
  userAge?: number;
  chatUserAges?: Record<string, number>; // Map of chat userId to age
}

const DirectMessages: React.FC<DirectMessagesProps> = ({ isOpen, onClose, userAge = 18, chatUserAges = {} }) => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      user: { name: 'Alex Rodriguez', avatar: 'AR', isOnline: true },
      lastMessage: 'Great match today! Your Charizard play was incredible.',
      timestamp: '2m ago',
      unreadCount: 2,
      messages: [
        {
          id: '1',
          senderId: 'alex',
          content: 'Hey! Saw your tournament result, congrats on top 4!',
          timestamp: '10:30 AM',
          isRead: true,
        },
        {
          id: '2',
          senderId: 'me',
          content: 'Thanks! It was a tough bracket but the team performed well.',
          timestamp: '10:32 AM',
          isRead: true,
        },
        {
          id: '3',
          senderId: 'alex',
          content: 'Great match today! Your Charizard play was incredible.',
          timestamp: '10:35 AM',
          isRead: false,
        },
      ],
    },
    {
      id: '2',
      user: { name: 'Sarah Kim', avatar: 'SK', isOnline: false },
      lastMessage: 'Want to practice for the upcoming regional?',
      timestamp: '1h ago',
      unreadCount: 0,
      messages: [
        {
          id: '1',
          senderId: 'sarah',
          content: 'Want to practice for the upcoming regional?',
          timestamp: '9:15 AM',
          isRead: true,
        },
      ],
    },
    {
      id: '3',
      user: { name: 'Marcus Johnson', avatar: 'MJ', isOnline: true },
      lastMessage: 'Check out this new team build I\'m testing',
      timestamp: '3h ago',
      unreadCount: 1,
      messages: [
        {
          id: '1',
          senderId: 'marcus',
          content: 'Check out this new team build I\'m testing',
          timestamp: '7:20 AM',
          isRead: false,
        },
      ],
    },
  ]);

  // Restrict messaging for under-18 users
  if (userAge < 18) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
          <MessageCircle className="h-8 w-8 text-yellow-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Messaging Restricted</h3>
        <p className="text-gray-600 text-center max-w-xs">
          For safety and safeguarding reasons, direct messaging is only available to users 18 and older.
        </p>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    );
  }

  const isMessagingRestricted = userAge < 18 || (selectedChat && chatUserAges[selectedChat] && chatUserAges[selectedChat] < 18);

  if (!isOpen) return null;

  const filteredChats = chats.filter(chat =>
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedChatData = chats.find(chat => chat.id === selectedChat);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
    };

    setChats(chats.map(chat =>
      chat.id === selectedChat
        ? {
            ...chat,
            messages: [...chat.messages, message],
            lastMessage: newMessage,
            timestamp: 'Just now',
          }
        : chat
    ));

    setNewMessage('');
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        {selectedChat ? (
          <>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSelectedChat(null)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {selectedChatData?.user.avatar}
                  </div>
                  {selectedChatData?.user.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedChatData?.user.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedChatData?.user.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Phone className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Video className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <MoreVertical className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-semibold">Messages</h2>
            </div>
          </>
        )}
      </div>

      {selectedChat ? (
        /* Chat View */
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedChatData?.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    message.senderId === 'me'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.senderId === 'me' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          {isMessagingRestricted ? (
            <div className="border-t p-4 text-center text-red-600 bg-red-50 rounded-b-xl">
              Messaging is disabled for users under 18 for privacy and safety reasons.
            </div>
          ) : (
            <div className="border-t p-4">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Chat List */
        <div className="flex-1">
          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="space-y-1">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className="w-full p-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {chat.user.avatar}
                    </div>
                    {chat.user.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 truncate">{chat.user.name}</h4>
                      <span className="text-sm text-gray-500">{chat.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unreadCount > 0 && (
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{chat.unreadCount}</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectMessages;