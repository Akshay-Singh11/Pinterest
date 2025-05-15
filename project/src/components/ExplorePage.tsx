import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { themeClasses } from '../utils/themeUtils';
import VirtualizedPinGrid from './VirtualizedPinGrid';
import { Pin } from '../types';
import { pins as initialPins } from '../data/pins';
import { Search, TrendingUp, Filter, X } from 'lucide-react';
import LazyImage from './LazyImage';

interface ExplorePageProps {
  onPinClick: (pin: Pin) => void;
  onSavePin: (pinId: string, saved: boolean) => void;
}

// Sample explore categories with enhanced metadata
const exploreCategories = [
  {
    id: 'trending',
    name: 'Trending',
    icon: '🔥',
    color: '#E60023',
    description: 'See what\'s popular right now',
    featuredImage: 'https://images.pexels.com/photos/1918290/pexels-photo-1918290.jpeg?auto=compress&cs=tinysrgb&w=600',
    topics: [
      {
        name: 'Weekly Top',
        image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=300',
        count: 42
      },
      {
        name: 'Rising Stars',
        image: 'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&cs=tinysrgb&w=300',
        count: 28
      },
      {
        name: 'Popular Now',
        image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=300',
        count: 35
      }
    ]
  },
  {
    id: 'home',
    name: 'Home',
    icon: '🏠',
    color: '#4A7C59',
    description: 'Find inspiration for your living space',
    featuredImage: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
    topics: [
      {
        name: 'Interior Design',
        image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=300',
        count: 56
      },
      {
        name: 'DIY Home',
        image: 'https://images.pexels.com/photos/6969926/pexels-photo-6969926.jpeg?auto=compress&cs=tinysrgb&w=300',
        count: 34
      },
      {
        name: 'Minimalist',
        image: 'https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg?auto=compress&cs=tinysrgb&w=300',
        count: 29
      },
      {
        name: 'Cozy Spaces',
        image: 'https://images.pexels.com/photos/2079249/pexels-photo-2079249.jpeg?auto=compress&cs=tinysrgb&w=300',
        count: 41
      }
    ]
  },
  {
    id: 'diy',
    name: 'DIY & Crafts',
    icon: '✂️',
    color: '#8E7DBE',
    description: 'Handmade projects and creative ideas',
    featuredImage: 'https://images.pexels.com/photos/3094218/pexels-photo-3094218.jpeg?auto=compress&cs=tinysrgb&w=600',
    topics: ['Paper Crafts', 'Upcycling', 'Handmade Gifts', 'Easy Projects']
  },
  {
    id: 'fashion',
    name: 'Fashion',
    icon: '👗',
    color: '#F28123',
    description: 'Discover the latest trends and styles',
    featuredImage: 'https://images.pexels.com/photos/2703202/pexels-photo-2703202.jpeg?auto=compress&cs=tinysrgb&w=600',
    topics: ['Street Style', 'Minimalist Fashion', 'Vintage', 'Accessories']
  },
  {
    id: 'food',
    name: 'Food & Drink',
    icon: '🍲',
    color: '#D62828',
    description: 'Recipes and culinary inspiration',
    featuredImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
    topics: ['Quick Recipes', 'Baking', 'Healthy Meals', 'Cocktails']
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: '✈️',
    color: '#1A936F',
    description: 'Explore destinations around the world',
    featuredImage: 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=600',
    topics: ['Hidden Gems', 'Budget Travel', 'Luxury Escapes', 'Road Trips']
  },
  {
    id: 'beauty',
    name: 'Beauty',
    icon: '💄',
    color: '#FF6B6B',
    description: 'Makeup, skincare, and beauty tips',
    featuredImage: 'https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg?auto=compress&cs=tinysrgb&w=600',
    topics: ['Skincare Routines', 'Natural Beauty', 'Makeup Looks', 'Hair Styles']
  },
  {
    id: 'photography',
    name: 'Photography',
    icon: '📷',
    color: '#3D5A80',
    description: 'Stunning photos and photography tips',
    featuredImage: 'https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg?auto=compress&cs=tinysrgb&w=600',
    topics: ['Portrait', 'Landscape', 'Street', 'Black & White']
  },
  {
    id: 'art',
    name: 'Art',
    icon: '🎨',
    color: '#7678ED',
    description: 'Discover beautiful artwork and creative inspiration',
    featuredImage: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=600',
    topics: ['Digital Art', 'Painting', 'Illustration', 'Sculpture']
  },
  {
    id: 'fitness',
    name: 'Fitness',
    icon: '💪',
    color: '#00AFB9',
    description: 'Workouts, health tips, and fitness motivation',
    featuredImage: 'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=600',
    topics: ['Home Workouts', 'Yoga', 'HIIT', 'Running']
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: '💻',
    color: '#5F6CAF',
    description: 'The latest in tech, gadgets, and digital trends',
    featuredImage: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=600',
    topics: ['Gadgets', 'Coding', 'AI', 'Smart Home']
  },
  {
    id: 'quotes',
    name: 'Quotes',
    icon: '💭',
    color: '#F9C80E',
    description: 'Inspirational and motivational quotes',
    featuredImage: 'https://images.pexels.com/photos/3808904/pexels-photo-3808904.jpeg?auto=compress&cs=tinysrgb&w=600',
    topics: ['Motivation', 'Life Quotes', 'Funny', 'Wisdom']
  }
];

// Generate pins for each category with more relevant content
const generateCategoryPins = (categoryId: string, topicFilter?: string): Pin[] => {
  // Create a seed based on category to ensure consistent but different results per category
  const seed = categoryId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Get a subset of pins with different selection logic per category
  let filteredPins = initialPins;

  // Apply different filtering logic based on category to simulate relevant content
  if (categoryId === 'trending') {
    // For trending, use pins with higher engagement (we'll simulate this with the pin ID)
    filteredPins = initialPins.filter(pin => parseInt(pin.id.split('-')[1] || '0') > 5);
  } else if (categoryId === 'photography' || categoryId === 'art') {
    // For visual categories, prioritize pins with larger images
    filteredPins = initialPins.filter(pin => pin.width > pin.height);
  } else {
    // For other categories, use a deterministic but seemingly random subset
    filteredPins = initialPins.filter((_, index) => (index + seed) % 4 === 0);
  }

  // Apply topic filter if provided
  if (topicFilter) {
    // In a real app, we'd filter by actual topics
    // Here we'll use a more sophisticated approach to make it seem like we're filtering by topic

    // Create a seed based on the topic name for deterministic but different results per topic
    const topicSeed = topicFilter.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // Different filtering strategies based on topic keywords
    if (topicFilter.toLowerCase().includes('minimalist')) {
      // For minimalist topics, prefer pins with shorter titles and descriptions
      filteredPins = filteredPins.filter(pin =>
        (pin.title.length < 30) ||
        (pin.description && pin.description.length < 60)
      );
    } else if (topicFilter.toLowerCase().includes('diy') || topicFilter.toLowerCase().includes('craft')) {
      // For DIY topics, prefer pins with longer descriptions (assuming they contain instructions)
      filteredPins = filteredPins.filter(pin => pin.description && pin.description.length > 40);
    } else if (topicFilter.toLowerCase().includes('popular') || topicFilter.toLowerCase().includes('top')) {
      // For popular topics, use pins with higher engagement (simulated with ID)
      filteredPins = filteredPins.filter(pin => parseInt(pin.id.split('-')[1] || '0') > 3);
    } else {
      // For other topics, use a deterministic but seemingly random subset
      filteredPins = filteredPins.filter((pin, index) => {
        // Use both the index and pin ID to create a more natural-looking filter
        const pinIdNum = parseInt(pin.id.split('-')[1] || '0');
        return ((index + topicSeed + pinIdNum) % 5) < 2;
      });
    }

    // Ensure we have at least 5 pins after filtering
    if (filteredPins.length < 5) {
      // Fall back to a simpler filter if we filtered too aggressively
      filteredPins = initialPins.filter((_, index) => (index + topicSeed) % 4 === 0);
    }
  }

  // Ensure we have at least 10 pins
  if (filteredPins.length < 10) {
    filteredPins = initialPins.slice(0, 10);
  }

  // Map pins to the category and add some category-specific modifications
  return filteredPins.map(pin => ({
    ...pin,
    id: `${pin.id}-${categoryId}${topicFilter ? `-${topicFilter}` : ''}`,
    category: categoryId,
    // Modify title for some categories to make content seem more relevant
    title: categoryId === 'quotes'
      ? `"${pin.title}" - Inspirational Quote`
      : categoryId === 'diy'
        ? `DIY Project: ${pin.title}`
        : pin.title
  }));
};

// Featured category component
const FeaturedCategory = ({
  category,
  isSelected,
  onSelect
}: {
  category: typeof exploreCategories[0],
  isSelected: boolean,
  onSelect: () => void
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={`relative rounded-lg overflow-hidden cursor-pointer transition-transform duration-200 transform ${
        isSelected ? 'scale-[1.02] ring-2 ring-offset-2' : 'hover:scale-[1.01]'
      }`}
      style={{
        boxShadow: isSelected ? `0 4px 12px ${category.color}40` : undefined,
        ringColor: category.color
      }}
      onClick={onSelect}
    >
      <div className="aspect-w-16 aspect-h-9 relative">
        <LazyImage
          src={category.featuredImage}
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <div className="flex items-center mb-1">
            <span className="text-xl mr-2">{category.icon}</span>
            <h3 className="text-lg font-bold">{category.name}</h3>
          </div>
          <p className="text-sm text-white/80">{category.description}</p>
        </div>
      </div>
    </div>
  );
};

// Topic chip component
const TopicChip = ({
  topic,
  isSelected,
  color,
  onClick,
  count,
  showCount = false
}: {
  topic: string,
  isSelected: boolean,
  color: string,
  onClick: () => void,
  count?: number,
  showCount?: boolean
}) => {
  const { theme } = useTheme();

  return (
    <button
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
        isSelected
          ? 'text-white shadow-sm'
          : theme === 'dark' ? 'text-dark-text hover:bg-dark-card/50' : 'text-gray-800 hover:bg-gray-100/80'
      }`}
      style={{
        backgroundColor: isSelected ? color : 'transparent',
        border: `1px solid ${isSelected ? color : theme === 'dark' ? '#333' : '#e5e7eb'}`,
        transform: isSelected ? 'scale(1.05)' : 'scale(1)'
      }}
      onClick={onClick}
    >
      <span>{topic}</span>
      {showCount && count !== undefined && (
        <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
          isSelected ? 'bg-white/20' : theme === 'dark' ? 'bg-dark-card' : 'bg-gray-200'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
};

// Topic card component for visual topic selection
const TopicCard = ({
  topic,
  image,
  isSelected,
  color,
  onClick,
  count
}: {
  topic: string,
  image: string,
  isSelected: boolean,
  color: string,
  onClick: () => void,
  count?: number
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 transform scale-[1.02]' : 'hover:scale-[1.01]'
      }`}
      style={{
        boxShadow: isSelected ? `0 4px 12px ${color}40` : undefined,
        ringColor: color
      }}
      onClick={onClick}
    >
      <div className="aspect-w-1 relative">
        <LazyImage
          src={image}
          alt={topic}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-3 text-white">
          <h3 className="text-sm font-bold">{topic}</h3>
          {count !== undefined && (
            <p className="text-xs text-white/80">{count} pins</p>
          )}
        </div>
        {isSelected && (
          <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-white flex items-center justify-center">
            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: color }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

// Filter panel component
const FilterPanel = ({
  isOpen,
  onClose,
  category,
  selectedTopic,
  onSelectTopic,
  theme
}: {
  isOpen: boolean,
  onClose: () => void,
  category: typeof exploreCategories[0],
  selectedTopic: string | undefined,
  onSelectTopic: (topic: string | undefined) => void,
  theme: string
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl ${themeClasses.bg(theme)} p-6`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-bold ${themeClasses.text(theme)}`}>
            Filter {category.name}
          </h2>
          <button
            className={`p-2 rounded-full ${themeClasses.hoverBg(theme)}`}
            onClick={onClose}
          >
            <X className={`h-5 w-5 ${theme === 'dark' ? 'text-dark-text' : 'text-gray-700'}`} />
          </button>
        </div>

        <div className="mb-6">
          <h3 className={`text-lg font-medium mb-3 ${themeClasses.text(theme)}`}>Topics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {category.topics.map(topic => (
              <TopicCard
                key={topic.name}
                topic={topic.name}
                image={topic.image}
                isSelected={selectedTopic === topic.name}
                color={category.color}
                count={topic.count}
                onClick={() => {
                  onSelectTopic(selectedTopic === topic.name ? undefined : topic.name);
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            className={`px-4 py-2 rounded-full ${themeClasses.hoverBg(theme)} mr-2`}
            onClick={() => onSelectTopic(undefined)}
          >
            Clear Filters
          </button>
          <button
            className="px-4 py-2 rounded-full bg-[#E60023] text-white"
            onClick={onClose}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

const ExplorePage: React.FC<ExplorePageProps> = ({ onPinClick, onSavePin }) => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('trending');
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'featured'>('featured');
  const [showTopicCards, setShowTopicCards] = useState(false);

  // Get the current category object
  const currentCategory = exploreCategories.find(c => c.id === selectedCategory) || exploreCategories[0];

  // Get topic names array for backward compatibility
  const topicNames = currentCategory.topics.map(topic => topic.name);

  // Get pins for the selected category and topic
  const categoryPins = generateCategoryPins(selectedCategory, selectedTopic);

  // Reset topic when category changes
  useEffect(() => {
    setSelectedTopic(undefined);
    setHasMore(true);
    // Show topic cards for certain categories
    setShowTopicCards(['home', 'travel', 'food', 'fashion'].includes(selectedCategory));
  }, [selectedCategory]);

  // Handle search within the category
  const filteredPins = searchQuery.trim()
    ? categoryPins.filter(pin =>
        pin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pin.description && pin.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : categoryPins;

  // Get the selected topic object
  const selectedTopicObj = selectedTopic
    ? currentCategory.topics.find(t => t.name === selectedTopic)
    : undefined;

  const loadMorePins = useCallback(() => {
    // In a real app, this would load more pins from an API
    console.log('Loading more pins for category:', selectedCategory, 'topic:', selectedTopic);

    // For demo purposes, we'll just set hasMore to false after first load
    setHasMore(false);
  }, [selectedCategory, selectedTopic]);

  return (
    <div className={`min-h-screen ${themeClasses.bg(theme)}`}>
      <div className="container mx-auto px-4 py-6">
        {/* Header with search and filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className={`text-2xl font-bold ${themeClasses.text(theme)}`}>
            Explore
          </h1>

          <div className="flex items-center mt-4 md:mt-0">
            {/* Search input */}
            <div className="relative mr-2">
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
                placeholder={`Search in ${currentCategory.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Filter button */}
            <button
              className={`p-2 rounded-full ${themeClasses.hoverBg(theme)} transition-colors relative`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className={`h-5 w-5 ${theme === 'dark' ? 'text-dark-text' : 'text-gray-700'}`} />
            </button>

            {/* View mode toggle */}
            <button
              className={`ml-2 p-2 rounded-full ${themeClasses.hoverBg(theme)} transition-colors`}
              onClick={() => setViewMode(viewMode === 'grid' ? 'featured' : 'grid')}
            >
              <TrendingUp className={`h-5 w-5 ${theme === 'dark' ? 'text-dark-text' : 'text-gray-700'}`} />
            </button>
          </div>
        </div>

        {/* Featured Categories (in featured view mode) */}
        {viewMode === 'featured' && (
          <div className="mb-8">
            <h2 className={`text-lg font-semibold mb-4 ${themeClasses.text(theme)}`}>
              Featured Categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {exploreCategories.slice(0, 6).map(category => (
                <FeaturedCategory
                  key={category.id}
                  category={category}
                  isSelected={selectedCategory === category.id}
                  onSelect={() => {
                    setSelectedCategory(category.id);
                    setHasMore(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Categories (horizontal scrolling in grid view) */}
        <div className={`${viewMode === 'grid' ? 'mb-6' : 'mb-2'} overflow-x-auto`}>
          <div className="flex space-x-3 pb-2">
            {exploreCategories.map(category => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full flex items-center whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'text-white'
                    : theme === 'dark'
                      ? 'bg-dark-card text-dark-text hover:bg-dark-border'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: selectedCategory === category.id ? category.color : undefined
                }}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setHasMore(true);
                }}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Category Header with Topics */}
        <div className="mb-6">
          <div className="flex items-center">
            <h2
              className={`text-xl font-semibold ${themeClasses.text(theme)}`}
              style={{ color: selectedCategory === currentCategory.id ? currentCategory.color : undefined }}
            >
              <span className="mr-2">{currentCategory.icon}</span>
              {currentCategory.name}
            </h2>

            {searchQuery && (
              <span className={`ml-3 text-sm ${themeClasses.textTertiary(theme)}`}>
                {filteredPins.length} results for "{searchQuery}"
              </span>
            )}
          </div>

          <p className={`mt-1 mb-4 ${themeClasses.textTertiary(theme)}`}>
            {currentCategory.description}
          </p>

          {/* Selected Filters */}
          {selectedTopic && (
            <div className="mb-4">
              <div className="flex items-center">
                <span className={`text-sm font-medium ${themeClasses.textSecondary(theme)} mr-2`}>
                  Filtered by:
                </span>
                <div className="flex items-center bg-gray-100 dark:bg-dark-card px-3 py-1 rounded-full">
                  <span className="text-sm font-medium" style={{ color: currentCategory.color }}>
                    {selectedTopic}
                  </span>
                  <button
                    className="ml-2 text-gray-500 hover:text-gray-700 dark:text-dark-text/70 dark:hover:text-dark-text"
                    onClick={() => setSelectedTopic(undefined)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>

                {selectedTopicObj && (
                  <span className={`ml-2 text-sm ${themeClasses.textTertiary(theme)}`}>
                    ({selectedTopicObj.count} pins)
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Visual Topic Cards */}
          {showTopicCards && !selectedTopic && (
            <div className="mb-6">
              <h3 className={`text-lg font-medium mb-3 ${themeClasses.text(theme)}`}>
                Popular Topics
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {currentCategory.topics.map(topic => (
                  <TopicCard
                    key={topic.name}
                    topic={topic.name}
                    image={topic.image}
                    isSelected={selectedTopic === topic.name}
                    color={currentCategory.color}
                    count={topic.count}
                    onClick={() => {
                      setSelectedTopic(selectedTopic === topic.name ? undefined : topic.name);
                      setHasMore(true);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Topics Chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            <TopicChip
              topic="All"
              isSelected={!selectedTopic}
              color={currentCategory.color}
              onClick={() => setSelectedTopic(undefined)}
            />
            {topicNames.map(topic => (
              <TopicChip
                key={topic}
                topic={topic}
                isSelected={selectedTopic === topic}
                color={currentCategory.color}
                showCount={true}
                count={currentCategory.topics.find(t => t.name === topic)?.count}
                onClick={() => {
                  setSelectedTopic(selectedTopic === topic ? undefined : topic);
                  setHasMore(true);
                }}
              />
            ))}
          </div>
        </div>

        {/* Filter Panel */}
        <FilterPanel
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          category={currentCategory}
          selectedTopic={selectedTopic}
          onSelectTopic={(topic) => {
            setSelectedTopic(topic);
            setHasMore(true);
          }}
          theme={theme}
        />

        {/* Pins Grid */}
        {filteredPins.length > 0 ? (
          <VirtualizedPinGrid
            pins={filteredPins}
            onPinClick={onPinClick}
            onSavePin={onSavePin}
            onLoadMore={loadMorePins}
            hasMore={hasMore}
          />
        ) : (
          <div className="py-20 text-center">
            <p className={`text-lg font-medium ${themeClasses.text(theme)}`}>
              No pins found for "{searchQuery}" in {currentCategory.name}
            </p>
            <button
              className="mt-4 px-4 py-2 bg-[#E60023] text-white rounded-full hover:bg-red-700"
              onClick={() => setSearchQuery('')}
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
