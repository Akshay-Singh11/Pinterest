import React, { useState, useCallback } from 'react';
import { memo } from 'react';
import { Heart, Bookmark, Share2, MoreHorizontal } from 'lucide-react';
import { Pin } from '../types';
import { useTheme } from '../context/ThemeContext';
import LazyImage from './LazyImage';
import UserAvatar from './UserAvatar';
import { themeClasses } from '../utils/themeUtils';

interface PinCardProps {
  pin: Pin;
  onClick: (pin: Pin) => void;
  onSave: (pinId: string, saved: boolean) => void;
}

function PinCardComponent({ pin, onClick, onSave }: PinCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(pin.saved);
  const [isLoaded, setIsLoaded] = useState(false);
  const { theme } = useTheme();

  const toggleSave = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    onSave(pin.id, newSavedState);
  }, [isSaved, onSave, pin.id]);

  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handlePinClick = useCallback(() => {
    onClick(pin);
  }, [onClick, pin]);

  return (
    <div
      className="mb-6 break-inside-avoid animate-fadeIn hardware-accelerated"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePinClick}
    >
      <div className={`relative group rounded-lg overflow-hidden ${themeClasses.card(theme)} cursor-pointer transform transition duration-200 hover:shadow-lg hardware-accelerated`}>
        {/* Image */}
        <div className="relative overflow-hidden rounded-lg">
          <LazyImage
            src={pin.imageUrl}
            alt={pin.title}
            width={pin.width}
            height={pin.height}
            className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
            style={{
              maxHeight: '600px'
            }}
            onLoad={handleImageLoad}
          />

          {/* Overlay */}
          <div
            className={`absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Action buttons */}
          <div className={`absolute top-2 right-2 flex flex-col space-y-2 transition-all duration-200 ${
            isHovered ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'
          }`}>
            <button
              onClick={toggleSave}
              className={`p-2 rounded-full ${
                isSaved ? 'bg-[#E60023] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              } shadow-md transition-colors`}
              aria-label={isSaved ? "Unsave pin" : "Save pin"}
            >
              <Bookmark className="h-5 w-5" />
            </button>
            <button
              className="p-2 rounded-full bg-white text-gray-700 hover:bg-gray-100 shadow-md transition-colors"
              aria-label="Share pin"
              onClick={(e) => e.stopPropagation()}
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button
              className="p-2 rounded-full bg-white text-gray-700 hover:bg-gray-100 shadow-md transition-colors"
              aria-label="More options"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>

          {/* Save button (mobile/always visible) */}
          <button
            onClick={toggleSave}
            className={`sm:hidden absolute top-2 right-2 p-2 rounded-full ${
              isSaved ? 'bg-[#E60023] text-white' : 'bg-white text-gray-700'
            } shadow-md transition-colors`}
            aria-label={isSaved ? "Unsave pin" : "Save pin"}
          >
            <Bookmark className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className={`font-medium ${themeClasses.text(theme)} line-clamp-2 mb-1`}>{pin.title}</h3>
          {pin.description && (
            <p className={`text-sm ${themeClasses.textSecondary(theme)} line-clamp-2 mb-2`}>{pin.description}</p>
          )}

          {/* User */}
          <UserAvatar
            src={pin.user.avatarUrl}
            alt={pin.user.name}
            showName={true}
            name={pin.user.name}
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
}

// Create a memoized version of the component
const PinCard = memo(PinCardComponent);

// Use displayName for better debugging
PinCard.displayName = 'PinCard';

export default PinCard;