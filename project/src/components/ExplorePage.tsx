import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { themeClasses } from '../utils/themeUtils';
import VirtualizedPinGrid from './VirtualizedPinGrid';
import { Pin } from '../types';
import { pins as initialPins } from '../data/pins';

interface ExplorePageProps {
  onPinClick: (pin: Pin) => void;
  onSavePin: (pinId: string, saved: boolean) => void;
}

// Sample explore categories
const exploreCategories = [
  { id: 'trending', name: 'Trending', icon: '🔥' },
  { id: 'home', name: 'Home', icon: '🏠' },
  { id: 'diy', name: 'DIY & Crafts', icon: '✂️' },
  { id: 'fashion', name: 'Fashion', icon: '👗' },
  { id: 'food', name: 'Food & Drink', icon: '🍲' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
  { id: 'beauty', name: 'Beauty', icon: '💄' },
  { id: 'photography', name: 'Photography', icon: '📷' },
  { id: 'art', name: 'Art', icon: '🎨' },
  { id: 'fitness', name: 'Fitness', icon: '💪' },
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'quotes', name: 'Quotes', icon: '💭' }
];

// Generate pins for each category
const generateCategoryPins = (categoryId: string): Pin[] => {
  // Filter pins that match the category or use a subset of initial pins
  return initialPins
    .filter((_, index) => index % 3 === 0) // Just to create a subset
    .map(pin => ({
      ...pin,
      id: `${pin.id}-${categoryId}`,
      category: categoryId
    }));
};

const ExplorePage: React.FC<ExplorePageProps> = ({ onPinClick, onSavePin }) => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('trending');
  const [hasMore, setHasMore] = useState(true);
  
  // Get pins for the selected category
  const categoryPins = generateCategoryPins(selectedCategory);
  
  const loadMorePins = () => {
    // In a real app, this would load more pins from an API
    console.log('Loading more pins for category:', selectedCategory);
    
    // For demo purposes, we'll just set hasMore to false after first load
    setHasMore(false);
  };
  
  return (
    <div className={`min-h-screen ${themeClasses.bg(theme)}`}>
      <div className="container mx-auto px-4 py-6">
        <h1 className={`text-2xl font-bold mb-6 ${themeClasses.text(theme)}`}>
          Explore
        </h1>
        
        {/* Categories */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-3 pb-2">
            {exploreCategories.map(category => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full flex items-center whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-[#E60023] text-white'
                    : theme === 'dark'
                      ? 'bg-dark-card text-dark-text hover:bg-dark-border'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setHasMore(true); // Reset hasMore when changing category
                }}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Category Title */}
        <div className="mb-6">
          <h2 className={`text-xl font-semibold ${themeClasses.text(theme)}`}>
            {exploreCategories.find(c => c.id === selectedCategory)?.icon}{' '}
            {exploreCategories.find(c => c.id === selectedCategory)?.name}
          </h2>
          <p className={`mt-1 ${themeClasses.textTertiary(theme)}`}>
            Discover the best ideas in {exploreCategories.find(c => c.id === selectedCategory)?.name.toLowerCase()}
          </p>
        </div>
        
        {/* Pins Grid */}
        <VirtualizedPinGrid
          pins={categoryPins}
          onPinClick={onPinClick}
          onSavePin={onSavePin}
          onLoadMore={loadMorePins}
          hasMore={hasMore}
        />
      </div>
    </div>
  );
};

export default ExplorePage;
