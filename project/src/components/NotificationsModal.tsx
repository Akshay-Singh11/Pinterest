import React from 'react';
import { X, Bell, Heart, MessageCircle, User, Plus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { themeClasses } from '../utils/themeUtils';
import UserAvatar from './UserAvatar';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Sample notification data
const notifications = [
  {
    id: '1',
    type: 'like',
    message: 'liked your pin',
    time: '2 hours ago',
    user: {
      name: 'Emma Watson',
      avatarUrl: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    pinImage: 'https://images.pexels.com/photos/1918290/pexels-photo-1918290.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '2',
    type: 'comment',
    message: 'commented on your pin',
    time: '5 hours ago',
    user: {
      name: 'John Doe',
      avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    pinImage: 'https://images.pexels.com/photos/1918290/pexels-photo-1918290.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '3',
    type: 'follow',
    message: 'started following you',
    time: '1 day ago',
    user: {
      name: 'Sarah Johnson',
      avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  },
  {
    id: '4',
    type: 'save',
    message: 'saved your pin',
    time: '2 days ago',
    user: {
      name: 'Michael Brown',
      avatarUrl: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    pinImage: 'https://images.pexels.com/photos/1918290/pexels-photo-1918290.jpeg?auto=compress&cs=tinysrgb&w=100'
  }
];

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'like':
      return <Heart className="h-4 w-4 text-pink-500" />;
    case 'comment':
      return <MessageCircle className="h-4 w-4 text-blue-500" />;
    case 'follow':
      return <User className="h-4 w-4 text-green-500" />;
    case 'save':
      return <Plus className="h-4 w-4 text-purple-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden md:inset-auto md:top-16 md:right-4 md:left-auto md:bottom-auto md:w-96 md:h-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className={`relative w-full h-full md:h-auto md:max-h-[80vh] md:rounded-lg shadow-xl ${themeClasses.bg(theme)} overflow-hidden`}>
        {/* Header */}
        <div className={`flex justify-between items-center p-4 border-b ${themeClasses.border(theme)}`}>
          <h2 className={`text-lg font-bold ${themeClasses.text(theme)}`}>Notifications</h2>
          <button 
            onClick={onClose}
            className={`p-2 ${themeClasses.hoverBg(theme)} rounded-full transition-colors`}
          >
            <X className={`h-5 w-5 ${theme === 'dark' ? 'text-dark-text' : ''}`} />
          </button>
        </div>
        
        {/* Notifications List */}
        <div className="overflow-y-auto max-h-[calc(100vh-8rem)] md:max-h-[60vh]">
          {notifications.length > 0 ? (
            <div>
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-4 border-b ${themeClasses.border(theme)} hover:bg-gray-50 dark:hover:bg-dark-card transition-colors cursor-pointer`}
                >
                  <div className="flex items-start">
                    <UserAvatar 
                      src={notification.user.avatarUrl}
                      alt={notification.user.name}
                      size="md"
                      className="flex-shrink-0"
                    />
                    
                    <div className="ml-3 flex-grow">
                      <div className="flex items-center">
                        <span className={`font-medium ${themeClasses.text(theme)}`}>
                          {notification.user.name}
                        </span>
                        <span className={`ml-1 ${themeClasses.textTertiary(theme)}`}>
                          {notification.message}
                        </span>
                      </div>
                      
                      <div className={`text-xs ${themeClasses.textTertiary(theme)} mt-1`}>
                        {notification.time}
                      </div>
                    </div>
                    
                    <div className="ml-2 flex-shrink-0">
                      {notification.pinImage && (
                        <img 
                          src={notification.pinImage} 
                          alt="Pin" 
                          className="h-12 w-12 object-cover rounded-md"
                        />
                      )}
                      {!notification.pinImage && (
                        <div className={`h-8 w-8 rounded-full ${themeClasses.bgSecondary(theme)} flex items-center justify-center`}>
                          <NotificationIcon type={notification.type} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Bell className={`h-12 w-12 mx-auto mb-4 ${themeClasses.textTertiary(theme)}`} />
              <p className={`${themeClasses.text(theme)} font-medium mb-2`}>No notifications yet</p>
              <p className={`${themeClasses.textTertiary(theme)}`}>
                When you get notifications, they'll show up here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
