import React from 'react';
import { Pin } from '../types';
import { useTheme } from '../context/ThemeContext';
import LazyImage from './LazyImage';
import { themeClasses } from '../utils/themeUtils';

interface RelatedPinsProps {
  pins: Pin[];
}

const RelatedPins: React.FC<RelatedPinsProps> = ({ pins }) => {
  // Show only 6 related pins at most
  const limitedPins = pins.slice(0, 6);
  const { theme } = useTheme();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {limitedPins.map(pin => (
        <div key={pin.id} className="rounded-lg overflow-hidden">
          <div className="relative pb-[100%]">
            <LazyImage
              src={pin.imageUrl}
              alt={pin.title}
              className="absolute inset-0 w-full h-full object-cover"
              width={1}
              height={1}
            />
          </div>
          <h3 className={`mt-1 text-sm font-medium line-clamp-1 ${themeClasses.text(theme)}`}>{pin.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default RelatedPins;