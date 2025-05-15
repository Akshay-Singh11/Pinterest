import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Pin } from '../types';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Pin[];
  isSearching: boolean;
  searchHistory: string[];
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  removeFromSearchHistory: (query: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{
  children: React.ReactNode;
  pins: Pin[];
}> = ({ children, pins }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Pin[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // Save search history to localStorage
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Debounced search function
  const debouncedSearch = useCallback(
    (query: string) => {
      if (query.trim() === '') {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      // Simulate search delay
      const timer = setTimeout(() => {
        const lowerQuery = query.toLowerCase();

        // Use more efficient search algorithm
        const results = pins.filter(pin => {
          const titleMatch = pin.title.toLowerCase().includes(lowerQuery);
          const descMatch = pin.description && pin.description.toLowerCase().includes(lowerQuery);
          const categoryMatch = pin.category.toLowerCase().includes(lowerQuery);

          return titleMatch || descMatch || categoryMatch;
        });

        setSearchResults(results);
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timer);
    },
    [pins]
  );

  // Perform search when query changes
  useEffect(() => {
    const cleanup = debouncedSearch(searchQuery);
    return cleanup;
  }, [searchQuery, debouncedSearch]);

  const addToSearchHistory = useCallback((query: string) => {
    if (query.trim() === '') return;

    setSearchHistory(prevHistory => {
      // Remove the query if it already exists to avoid duplicates
      const filteredHistory = prevHistory.filter(item => item !== query);

      // Add the new query to the beginning of the array
      return [query, ...filteredHistory].slice(0, 10); // Keep only the 10 most recent searches
    });
  }, []);

  const removeFromSearchHistory = useCallback((query: string) => {
    setSearchHistory(prevHistory => prevHistory.filter(item => item !== query));
  }, []);

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchResults,
        isSearching,
        searchHistory,
        addToSearchHistory,
        clearSearchHistory,
        removeFromSearchHistory
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
