import React, { useState } from 'react';
import { X, Heart, Bookmark, Share2, MoreHorizontal, MessageCircle, ExternalLink } from 'lucide-react';
import { Pin } from '../types';
import RelatedPins from './RelatedPins';
import { useTheme } from '../context/ThemeContext';
import LazyImage from './LazyImage';
import UserAvatar from './UserAvatar';
import { themeClasses } from '../utils/themeUtils';

interface PinDetailModalProps {
  pin: Pin | null;
  isOpen: boolean;
  onClose: () => void;
  relatedPins: Pin[];
}

const PinDetailModal: React.FC<PinDetailModalProps> = ({ pin, isOpen, onClose, relatedPins }) => {
  const [isSaved, setIsSaved] = useState(pin?.saved || false);
  const { theme } = useTheme();

  if (!isOpen || !pin) return null;

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`${theme === 'dark' ? 'bg-dark-bg' : 'bg-white'} rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button - mobile only */}
        <button
          onClick={onClose}
          className={`absolute top-4 left-4 p-2 ${theme === 'dark' ? 'bg-dark-card text-dark-text' : 'bg-white'} rounded-full shadow-md md:hidden z-10`}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Image Section */}
        <div className="flex-1 bg-black flex items-center justify-center min-h-[50vh] md:min-h-0">
          <LazyImage
            src={pin.imageUrl}
            alt={pin.title}
            className="max-w-full max-h-[80vh] object-contain"
            priority={true} // Load immediately as it's the main content
            width={pin.width}
            height={pin.height}
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col h-full">
          {/* Header with actions */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={onClose}
              className={`p-2 ${theme === 'dark' ? 'hover:bg-dark-card text-dark-text' : 'hover:bg-gray-100'} rounded-full transition-colors hidden md:block`}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex space-x-2">
              <button className={`p-2 ${theme === 'dark' ? 'hover:bg-dark-card text-dark-text' : 'hover:bg-gray-100'} rounded-full transition-colors`}>
                <Share2 className="h-5 w-5" />
              </button>
              <button className={`p-2 ${theme === 'dark' ? 'hover:bg-dark-card text-dark-text' : 'hover:bg-gray-100'} rounded-full transition-colors`}>
                <ExternalLink className="h-5 w-5" />
              </button>
              <button className={`p-2 ${theme === 'dark' ? 'hover:bg-dark-card text-dark-text' : 'hover:bg-gray-100'} rounded-full transition-colors`}>
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Pin Title & Description */}
          <div className="mb-6">
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-dark-text' : 'text-gray-900'} mb-2`}>{pin.title}</h1>
            {pin.description && (
              <p className={`${theme === 'dark' ? 'text-dark-text/80' : 'text-gray-600'}`}>{pin.description}</p>
            )}
          </div>

          {/* User information */}
          <div className="flex items-center mb-6">
            <UserAvatar
              src={pin.user.avatarUrl}
              alt={pin.user.name}
              size="lg"
              className="mr-3"
            />
            <div>
              <div className={`font-medium ${themeClasses.text(theme)}`}>{pin.user.name}</div>
              <div className={`text-sm ${themeClasses.textTertiary(theme)}`}>Created 4 weeks ago</div>
            </div>
          </div>

          {/* Comments Section (Placeholder) */}
          <div className={`border-t border-b ${theme === 'dark' ? 'border-dark-border' : ''} py-6 mb-6`}>
            <div className="flex items-center mb-4">
              <MessageCircle className={`h-5 w-5 ${theme === 'dark' ? 'text-dark-text/80' : 'text-gray-600'} mr-2`} />
              <span className={`font-medium ${theme === 'dark' ? 'text-dark-text' : ''}`}>Comments</span>
            </div>
            <div className={`${theme === 'dark' ? 'text-dark-text/70' : 'text-gray-500'} text-sm italic`}>No comments yet! Add the first comment.</div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mb-8">
            <button
              onClick={toggleSave}
              className={`flex-1 py-3 px-4 rounded-full font-medium ${
                isSaved
                  ? 'bg-gray-900 text-white'
                  : 'bg-[#E60023] text-white hover:bg-red-700'
              } transition-colors flex items-center justify-center`}
            >
              <Bookmark className="h-5 w-5 mr-2" />
              {isSaved ? 'Saved' : 'Save'}
            </button>

            <button className={`flex-1 py-3 px-4 ${theme === 'dark' ? 'bg-dark-card hover:bg-dark-border text-dark-text' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'} rounded-full font-medium transition-colors flex items-center justify-center`}>
              <Heart className="h-5 w-5 mr-2" />
              Like
            </button>
          </div>

          {/* Related Pins */}
          <div className="mt-auto">
            <h2 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-dark-text' : ''}`}>More like this</h2>
            <RelatedPins pins={relatedPins} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinDetailModal;