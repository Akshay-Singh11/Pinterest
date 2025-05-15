import React from 'react';
import { Search, Clock, X } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { useTheme } from '../context/ThemeContext';

interface SearchSuggestionsProps {
  query: string;
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
  isVisible: boolean;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  suggestions,
  onSelectSuggestion,
  isVisible
}) => {
  const { searchHistory, removeFromSearchHistory, clearSearchHistory } = useSearch();
  const { theme } = useTheme();

  if (!isVisible) return null;

  return (
    <div className={`absolute top-full left-0 right-0 mt-1 ${theme === 'dark' ? 'bg-dark-card border border-dark-border' : 'bg-white'} rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto`}>
      {/* Search History */}
      {searchHistory.length > 0 && !query && (
        <div className="p-2">
          <div className="flex justify-between items-center px-3 py-2">
            <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-dark-text' : 'text-gray-700'}`}>Recent searches</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearSearchHistory();
              }}
              className={`text-xs ${theme === 'dark' ? 'text-dark-text/70 hover:text-dark-text' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Clear all
            </button>
          </div>

          {searchHistory.map((historyItem, index) => (
            <div
              key={`history-${index}`}
              className={`flex items-center justify-between p-3 ${theme === 'dark' ? 'hover:bg-dark-border' : 'hover:bg-gray-100'} rounded-lg cursor-pointer transition-colors`}
            >
              <div
                className="flex items-center flex-grow"
                onClick={() => onSelectSuggestion(historyItem)}
              >
                <Clock className={`h-4 w-4 ${theme === 'dark' ? 'text-dark-text/70' : 'text-gray-500'} mr-3`} />
                <span className={theme === 'dark' ? 'text-dark-text' : ''}>
                  {historyItem}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromSearchHistory(historyItem);
                }}
                className={`p-1 ${theme === 'dark' ? 'hover:bg-dark-bg text-dark-text/50 hover:text-dark-text' : 'hover:bg-gray-200 text-gray-400 hover:text-gray-600'} rounded-full`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search Suggestions */}
      {query && suggestions.length > 0 && (
        <div className="p-2">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`flex items-center p-3 ${theme === 'dark' ? 'hover:bg-dark-border' : 'hover:bg-gray-100'} rounded-lg cursor-pointer transition-colors`}
              onClick={() => onSelectSuggestion(suggestion)}
            >
              <Search className={`h-4 w-4 ${theme === 'dark' ? 'text-dark-text/70' : 'text-gray-500'} mr-3`} />
              <span className={theme === 'dark' ? 'text-dark-text' : ''}>
                {suggestion.split(new RegExp(`(${query})`, 'i')).map((part, i) =>
                  part.toLowerCase() === query.toLowerCase()
                    ? <strong key={i} className="font-medium">{part}</strong>
                    : part
                )}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {query && suggestions.length === 0 && (
        <div className="p-6 text-center">
          <p className={`${theme === 'dark' ? 'text-dark-text/70' : 'text-gray-500'}`}>
            No suggestions found for "{query}"
          </p>
        </div>
      )}

      {/* Footer */}
      {query && (
        <div className={`border-t ${theme === 'dark' ? 'border-dark-border' : ''} px-4 py-2`}>
          <p className={`text-xs ${theme === 'dark' ? 'text-dark-text/70' : 'text-gray-500'}`}>
            Press Enter to see all results for "{query}"
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;