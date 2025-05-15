import React, { useState } from 'react';
import { X, Settings, Plus, Grid, Bookmark, LogOut } from 'lucide-react';
import { Pin } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LazyImage from './LazyImage';
import UserAvatar from './UserAvatar';
import { themeClasses } from '../utils/themeUtils';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  savedPins: Pin[];
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose, savedPins }) => {
  const [activeTab, setActiveTab] = useState<'pins' | 'boards'>('pins');
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  if (!isOpen) return null;

  // Use authenticated user info if available, otherwise fallback to demo data
  const userInfo = {
    name: user?.name || 'Guest User',
    username: user ? `@${user.name.toLowerCase().replace(/\s+/g, '')}` : '@guest',
    email: user?.email || '',
    bio: 'Passionate about interior design and minimalist aesthetics. Collecting ideas for my home renovation project.',
    followers: 142,
    following: 89,
    avatarUrl: user?.avatarUrl || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
  };

  return (
    <div
      className={`fixed inset-0 ${theme === 'dark' ? 'bg-dark-bg' : 'bg-white'} z-50 overflow-y-auto`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className={`sticky top-0 z-10 ${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-white'} shadow-sm p-4 flex justify-between items-center`}>
        <button
          onClick={onClose}
          className={`p-2 ${theme === 'dark' ? 'hover:bg-dark-card text-dark-text' : 'hover:bg-gray-100'} rounded-full transition-colors`}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={logout}
            className={`p-2 ${theme === 'dark' ? 'hover:bg-dark-card text-dark-text' : 'hover:bg-gray-100'} rounded-full transition-colors flex items-center`}
          >
            <LogOut className="h-5 w-5" />
          </button>
          <button className={`p-2 ${theme === 'dark' ? 'hover:bg-dark-card text-dark-text' : 'hover:bg-gray-100'} rounded-full transition-colors`}>
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Profile Information */}
      <div className="flex flex-col items-center pt-8 pb-6">
        <div className="relative mb-4">
          <div className={`h-20 w-20 rounded-full overflow-hidden border-2 ${theme === 'dark' ? 'border-dark-card' : 'border-white'} shadow-sm`}>
            <LazyImage
              src={userInfo.avatarUrl}
              alt={userInfo.name}
              className="h-full w-full object-cover"
              priority={true}
            />
          </div>
          <button className={`absolute bottom-0 right-0 ${theme === 'dark' ? 'bg-dark-card text-dark-text hover:bg-dark-border' : 'bg-gray-200 hover:bg-gray-300'} p-1.5 rounded-full transition-colors`}>
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <h1 className={`text-2xl font-bold ${themeClasses.text(theme)}`}>{userInfo.name}</h1>
        <p className={`${themeClasses.textTertiary(theme)} mb-2`}>{userInfo.username}</p>
        {userInfo.email && (
          <p className={`${themeClasses.textTertiary(theme)} mb-2 text-sm`}>{userInfo.email}</p>
        )}

        <p className={`text-center max-w-md px-4 mb-4 ${themeClasses.textSecondary(theme)}`}>{userInfo.bio}</p>

        <div className="flex space-x-6">
          <div className="text-center">
            <div className={`font-bold ${themeClasses.text(theme)}`}>{userInfo.followers}</div>
            <div className={`${themeClasses.textTertiary(theme)} text-sm`}>followers</div>
          </div>
          <div className="text-center">
            <div className={`font-bold ${themeClasses.text(theme)}`}>{userInfo.following}</div>
            <div className={`${themeClasses.textTertiary(theme)} text-sm`}>following</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`border-t ${theme === 'dark' ? 'border-dark-border' : 'border-gray-200'}`}>
        <div className="flex justify-center">
          <button
            onClick={() => setActiveTab('pins')}
            className={`px-6 py-4 font-medium border-b-2 transition-colors ${
              activeTab === 'pins'
                ? theme === 'dark'
                  ? 'border-pinterest-red text-dark-text'
                  : 'border-black text-black'
                : theme === 'dark'
                  ? 'border-transparent text-dark-text/70 hover:text-dark-text'
                  : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <div className="flex items-center">
              <Grid className="h-5 w-5 mr-2" />
              Pins
            </div>
          </button>

          <button
            onClick={() => setActiveTab('boards')}
            className={`px-6 py-4 font-medium border-b-2 transition-colors ${
              activeTab === 'boards'
                ? theme === 'dark'
                  ? 'border-pinterest-red text-dark-text'
                  : 'border-black text-black'
                : theme === 'dark'
                  ? 'border-transparent text-dark-text/70 hover:text-dark-text'
                  : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <div className="flex items-center">
              <Bookmark className="h-5 w-5 mr-2" />
              Boards
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'pins' ? (
          <div>
            {savedPins.length > 0 ? (
              <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">
                {savedPins.map(pin => (
                  <div key={pin.id} className="mb-4 break-inside-avoid">
                    <div className="rounded-lg overflow-hidden">
                      <LazyImage
                        src={pin.imageUrl}
                        alt={pin.title}
                        className="w-full object-cover"
                        width={pin.width}
                        height={pin.height}
                      />
                    </div>
                    <h3 className={`mt-1 text-sm font-medium ${themeClasses.text(theme)}`}>{pin.title}</h3>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className={`${theme === 'dark' ? 'text-dark-text/70' : 'text-gray-500'}`}>No saved pins yet</p>
                <button className="mt-4 px-4 py-2 bg-[#E60023] text-white rounded-full hover:bg-red-700">
                  Discover ideas
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className={`${theme === 'dark' ? 'text-dark-text/70' : 'text-gray-500'}`}>No boards created yet</p>
            <button className="mt-4 px-4 py-2 bg-[#E60023] text-white rounded-full hover:bg-red-700">
              Create board
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;