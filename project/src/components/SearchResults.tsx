import React from 'react';
import { useSearch } from '../context/SearchContext';
import PinCard from './PinCard';
import VirtualizedPinGrid from './VirtualizedPinGrid';
import { Pin } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Search, Loader } from 'lucide-react';

interface SearchResultsProps {
  onPinClick: (pin: Pin) => void;
  onSavePin: (pinId: string, saved: boolean) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ onPinClick, onSavePin }) => {
  const { searchQuery, searchResults, isSearching } = useSearch();
  const { theme } = useTheme();

  if (searchQuery.trim() === '') {
    return null;
  }

  return (
    <div className={`w-full ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'} min-h-screen pt-4 pb-12`}>
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-dark-text' : 'text-gray-900'}`}>
            Search results for "{searchQuery}"
          </h2>
          <p className={`mt-2 ${theme === 'dark' ? 'text-dark-text/70' : 'text-gray-600'}`}>
            {isSearching
              ? 'Searching...'
              : searchResults.length > 0
                ? `Found ${searchResults.length} results`
                : 'No results found'}
          </p>
        </div>

        {isSearching ? (
          <div className="flex justify-center items-center py-20">
            <Loader className={`h-10 w-10 ${theme === 'dark' ? 'text-dark-text' : 'text-gray-600'} animate-spin`} />
          </div>
        ) : searchResults.length > 0 ? (
          <VirtualizedPinGrid
            pins={searchResults}
            onPinClick={onPinClick}
            onSavePin={onSavePin}
            onLoadMore={() => {}} // No load more for search results
            hasMore={false}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <Search className={`h-16 w-16 ${theme === 'dark' ? 'text-dark-text/50' : 'text-gray-400'} mb-4`} />
            <h3 className={`text-xl font-medium ${theme === 'dark' ? 'text-dark-text' : 'text-gray-900'} mb-2`}>
              No pins found
            </h3>
            <p className={`text-center max-w-md ${theme === 'dark' ? 'text-dark-text/70' : 'text-gray-600'}`}>
              We couldn't find any pins matching "{searchQuery}". Try using different keywords or check for typos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
