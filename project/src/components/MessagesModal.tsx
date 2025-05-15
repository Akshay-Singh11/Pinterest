import React, { useState } from 'react';
import { X, MessageCircle, Send, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { themeClasses } from '../utils/themeUtils';
import UserAvatar from './UserAvatar';

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Sample conversation data
const conversations = [
  {
    id: '1',
    user: {
      name: 'Emma Watson',
      avatarUrl: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    lastMessage: 'I love this design! Can you share more details?',
    time: '2 hours ago',
    unread: true
  },
  {
    id: '2',
    user: {
      name: 'John Doe',
      avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    lastMessage: 'Thanks for sharing that pin!',
    time: '1 day ago',
    unread: false
  },
  {
    id: '3',
    user: {
      name: 'Sarah Johnson',
      avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    lastMessage: 'Do you have any more ideas for the kitchen renovation?',
    time: '3 days ago',
    unread: false
  }
];

// Sample messages for a conversation
const sampleMessages = [
  {
    id: 'm1',
    sender: 'them',
    text: 'Hi there! I really liked your pin about minimalist living rooms.',
    time: '2 days ago'
  },
  {
    id: 'm2',
    sender: 'me',
    text: 'Thanks! I\'ve been working on redesigning my apartment.',
    time: '2 days ago'
  },
  {
    id: 'm3',
    sender: 'them',
    text: 'I love this design! Can you share more details about where you got that coffee table?',
    time: '2 hours ago'
  }
];

const MessagesModal: React.FC<MessagesModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  if (!isOpen) return null;

  const filteredConversations = conversations.filter(
    conv => conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', messageText);
      setMessageText('');
    }
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden md:inset-auto md:top-16 md:right-4 md:left-auto md:bottom-auto md:w-96 md:h-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className={`relative w-full h-full md:h-auto md:max-h-[80vh] md:rounded-lg shadow-xl ${themeClasses.bg(theme)} overflow-hidden flex flex-col`}>
        {/* Header */}
        <div className={`flex justify-between items-center p-4 border-b ${themeClasses.border(theme)}`}>
          <h2 className={`text-lg font-bold ${themeClasses.text(theme)}`}>
            {activeConversation ? 'Conversation' : 'Messages'}
          </h2>
          <div className="flex items-center space-x-2">
            {activeConversation && (
              <button 
                onClick={() => setActiveConversation(null)}
                className={`p-2 ${themeClasses.hoverBg(theme)} rounded-full transition-colors`}
              >
                <MessageCircle className={`h-5 w-5 ${theme === 'dark' ? 'text-dark-text' : ''}`} />
              </button>
            )}
            <button 
              onClick={onClose}
              className={`p-2 ${themeClasses.hoverBg(theme)} rounded-full transition-colors`}
            >
              <X className={`h-5 w-5 ${theme === 'dark' ? 'text-dark-text' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* Conversation List or Active Conversation */}
        {!activeConversation ? (
          <div className="flex-1 overflow-y-auto">
            {/* Search */}
            <div className="p-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className={`h-4 w-4 ${theme === 'dark' ? 'text-dark-text/50' : 'text-gray-400'}`} />
                </div>
                <input
                  type="text"
                  className={`block w-full p-2 pl-10 text-sm ${
                    theme === 'dark' 
                      ? 'text-dark-text bg-dark-card border border-dark-border' 
                      : 'text-gray-900 bg-gray-100'
                  } rounded-full focus:ring-2 focus:ring-red-500 focus:outline-none`}
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Conversations */}
            {filteredConversations.length > 0 ? (
              <div>
                {filteredConversations.map(conversation => (
                  <div 
                    key={conversation.id} 
                    className={`p-4 border-b ${themeClasses.border(theme)} hover:bg-gray-50 dark:hover:bg-dark-card transition-colors cursor-pointer`}
                    onClick={() => setActiveConversation(conversation.id)}
                  >
                    <div className="flex items-center">
                      <UserAvatar 
                        src={conversation.user.avatarUrl}
                        alt={conversation.user.name}
                        size="md"
                      />
                      
                      <div className="ml-3 flex-grow">
                        <div className="flex justify-between items-center">
                          <span className={`font-medium ${themeClasses.text(theme)}`}>
                            {conversation.user.name}
                          </span>
                          <span className={`text-xs ${themeClasses.textTertiary(theme)}`}>
                            {conversation.time}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <p className={`text-sm truncate ${conversation.unread 
                            ? `font-medium ${themeClasses.text(theme)}` 
                            : themeClasses.textTertiary(theme)}`}
                          >
                            {conversation.lastMessage}
                          </p>
                          
                          {conversation.unread && (
                            <span className="ml-2 h-2 w-2 bg-[#E60023] rounded-full"></span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <MessageCircle className={`h-12 w-12 mx-auto mb-4 ${themeClasses.textTertiary(theme)}`} />
                <p className={`${themeClasses.text(theme)} font-medium mb-2`}>No messages yet</p>
                <p className={`${themeClasses.textTertiary(theme)}`}>
                  Connect with creators and share ideas
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Conversation Header */}
            <div className={`p-3 border-b ${themeClasses.border(theme)} flex items-center`}>
              {conversations.find(c => c.id === activeConversation)?.user && (
                <UserAvatar 
                  src={conversations.find(c => c.id === activeConversation)?.user.avatarUrl || ''}
                  alt={conversations.find(c => c.id === activeConversation)?.user.name || ''}
                  size="md"
                  showName
                  name={conversations.find(c => c.id === activeConversation)?.user.name}
                />
              )}
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {sampleMessages.map(message => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[75%] rounded-lg p-3 ${
                      message.sender === 'me'
                        ? 'bg-[#E60023] text-white'
                        : theme === 'dark' ? 'bg-dark-card text-dark-text' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p>{message.text}</p>
                    <div className={`text-xs mt-1 ${message.sender === 'me' ? 'text-white/70' : themeClasses.textTertiary(theme)}`}>
                      {message.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message Input */}
            <form onSubmit={handleSendMessage} className={`p-3 border-t ${themeClasses.border(theme)} flex items-center`}>
              <input
                type="text"
                className={`flex-grow p-2 text-sm ${
                  theme === 'dark' 
                    ? 'text-dark-text bg-dark-card border border-dark-border' 
                    : 'text-gray-900 bg-gray-100 border border-gray-300'
                } rounded-full focus:ring-2 focus:ring-red-500 focus:outline-none`}
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <button 
                type="submit"
                className={`ml-2 p-2 ${messageText.trim() ? 'bg-[#E60023] text-white' : themeClasses.bgSecondary(theme)} rounded-full`}
                disabled={!messageText.trim()}
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesModal;
