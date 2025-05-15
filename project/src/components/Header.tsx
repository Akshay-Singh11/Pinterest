import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Bell, MessageCircle, User, ChevronDown, Menu, X, Plus, Home, Compass, Moon, Sun, LogOut } from 'lucide-react';
import { Logo } from './Logo';
import SearchSuggestions from './SearchSuggestions';
import { useTheme } from '../context/ThemeContext';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import { debounce } from '../utils/debounce';
import UserAvatar from './UserAvatar';
import { themeClasses } from '../utils/themeUtils';

interface HeaderProps {
  onOpenCreatePin: () => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
  onOpenMessages: () => void;
  onNavigate: (page: 'home' | 'explore' | 'search') => void;
  currentPage: 'home' | 'explore' | 'search';
}

const Header: React.FC<HeaderProps> = ({
  onOpenCreatePin,
  onOpenProfile,
  onOpenNotifications,
  onOpenMessages,
  onNavigate,
  currentPage
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const {
    searchQuery,
    setSearchQuery,
    addToSearchHistory
  } = useSearch();
  const { isAuthenticated, user, logout } = useAuth();

  const suggestions = searchQuery
    ? ['DIY home decor', 'home office design', 'minimalist living room', 'scandinavian interior', 'coastal bedroom',
       'kitchen renovation', 'travel destinations', 'healthy recipes', 'workout routines', 'wedding ideas']
        .filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('button')
      ) {
        setIsMenuOpen(false);
      }

      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }

      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('[data-user-menu-toggle]')
      ) {
        setShowUserMenu(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounced search change handler
  const debouncedSetSearchQuery = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
    }, 300),
    [setSearchQuery]
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Update local state immediately for UI responsiveness
    setSearchQuery(value);
    setShowSuggestions(true);
    // Debounce the actual search query update
    debouncedSetSearchQuery(value);
  }, [debouncedSetSearchQuery, setSearchQuery]);

  const handleSearchFocus = useCallback(() => {
    setShowSuggestions(true);
  }, []);

  const handleSelectSuggestion = useCallback((suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    addToSearchHistory(suggestion);
  }, [setSearchQuery, addToSearchHistory]);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addToSearchHistory(searchQuery);
      setShowSuggestions(false);
      onNavigate('search');
    }
  }, [searchQuery, addToSearchHistory, onNavigate]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200 ${
        isScrolled
          ? theme === 'dark'
            ? 'bg-dark-bg shadow-md'
            : 'bg-white shadow-md'
          : theme === 'dark'
            ? 'bg-dark-bg/95 backdrop-blur-sm'
            : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center p-2 text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Logo className="h-8 w-8 text-[#E60023]" />
            <span className="ml-2 text-lg font-bold text-[#E60023] hidden sm:block">Pinterest</span>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex flex-grow mx-6">
            <div className="flex space-x-2 items-center">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-full ${
                  currentPage === 'home'
                    ? 'text-white bg-[#E60023] hover:bg-red-700'
                    : 'text-gray-700 hover:bg-gray-100'
                } transition-colors flex items-center`}
                onClick={() => onNavigate('home')}
              >
                <Home className="h-4 w-4 mr-1.5" />
                Home
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-full ${
                  currentPage === 'explore'
                    ? 'text-white bg-[#E60023] hover:bg-red-700'
                    : 'text-gray-700 hover:bg-gray-100'
                } transition-colors flex items-center`}
                onClick={() => onNavigate('explore')}
              >
                <Compass className="h-4 w-4 mr-1.5" />
                Explore
              </button>
              <button
                className="px-4 py-2 text-sm font-medium rounded-full text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
                onClick={onOpenCreatePin}
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Create
              </button>
            </div>
          </nav>

          {/* Search */}
          <div className="flex-grow mx-4 hidden sm:block max-w-2xl" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className={`h-5 w-5 ${theme === 'dark' ? 'text-dark-text/50' : 'text-gray-400'}`} />
              </div>
              <input
                type="text"
                className={`block w-full p-2.5 pl-10 text-sm ${
                  theme === 'dark'
                    ? 'text-dark-text bg-dark-card focus:bg-dark-card/80 border border-dark-border'
                    : 'text-gray-900 bg-gray-100 focus:bg-white'
                } rounded-full focus:ring-2 focus:ring-red-500 focus:outline-none transition-all duration-200`}
                placeholder="Search for ideas..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
              />

              <SearchSuggestions
                query={searchQuery}
                suggestions={suggestions}
                onSelectSuggestion={handleSelectSuggestion}
                isVisible={showSuggestions}
              />
            </form>
          </div>

          {/* User actions */}
          <div className="hidden md:flex items-center space-x-1">
            <button
              className={`p-2.5 rounded-full ${theme === 'dark' ? 'hover:bg-dark-card' : 'hover:bg-gray-100'} transition-colors relative group`}
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <Sun className="h-6 w-6 text-dark-text" />
              ) : (
                <Moon className="h-6 w-6 text-gray-700" />
              )}
              <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </span>
            </button>
            <button
              className={`p-2.5 rounded-full ${theme === 'dark' ? 'hover:bg-dark-card' : 'hover:bg-gray-100'} transition-colors relative group`}
              aria-label="Notifications"
              onClick={onOpenNotifications}
            >
              <Bell className={`h-6 w-6 ${theme === 'dark' ? 'text-dark-text' : 'text-gray-700'}`} />
              <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-[#E60023] rounded-full border-2 border-white dark:border-dark-bg"></span>
              <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Notifications
              </span>
            </button>
            <button
              className={`p-2.5 rounded-full ${theme === 'dark' ? 'hover:bg-dark-card' : 'hover:bg-gray-100'} transition-colors relative group`}
              aria-label="Messages"
              onClick={onOpenMessages}
            >
              <MessageCircle className={`h-6 w-6 ${theme === 'dark' ? 'text-dark-text' : 'text-gray-700'}`} />
              <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Messages
              </span>
            </button>
            {isAuthenticated ? (
              <div className="relative">
                <button
                  className={`p-1.5 rounded-full ${theme === 'dark' ? 'hover:bg-dark-card' : 'hover:bg-gray-100'} transition-colors relative group flex items-center`}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  data-user-menu-toggle
                  aria-label="User profile"
                >
                  <UserAvatar
                    src={user?.avatarUrl || ''}
                    alt={user?.name || ''}
                    size="sm"
                  />
                  <ChevronDown className={`h-4 w-4 ml-1 ${theme === 'dark' ? 'text-dark-text' : 'text-gray-700'}`} />
                </button>

                {/* User dropdown menu */}
                {showUserMenu && (
                  <div
                    ref={userMenuRef}
                    className={`absolute right-0 mt-2 w-48 ${theme === 'dark' ? 'bg-dark-card border border-dark-border' : 'bg-white'} rounded-lg shadow-lg py-1 z-50`}
                  >
                    <div className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-dark-border' : 'border-gray-200'}`}>
                      <p className={`font-medium ${theme === 'dark' ? 'text-dark-text' : 'text-gray-900'}`}>{user?.name}</p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-dark-text/70' : 'text-gray-500'}`}>{user?.email}</p>
                    </div>
                    <button
                      className={`w-full text-left px-4 py-2 ${theme === 'dark' ? 'hover:bg-dark-border text-dark-text' : 'hover:bg-gray-100 text-gray-700'} flex items-center`}
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenProfile();
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </button>
                    <button
                      className={`w-full text-left px-4 py-2 ${theme === 'dark' ? 'hover:bg-dark-border text-dark-text' : 'hover:bg-gray-100 text-gray-700'} flex items-center`}
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className={`p-2.5 rounded-full ${theme === 'dark' ? 'hover:bg-dark-card' : 'hover:bg-gray-100'} transition-colors relative group`}
                onClick={onOpenProfile}
                aria-label="User profile"
              >
                <User className={`h-6 w-6 ${theme === 'dark' ? 'text-dark-text' : 'text-gray-700'}`} />
                <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Log in
                </span>
              </button>
            )}
          </div>

          {/* Mobile action buttons */}
          <div className="flex items-center sm:hidden">
            <button
              className="p-2.5 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Search"
            >
              <Search className="h-6 w-6" />
            </button>
            <button
              className="p-2.5 ml-1 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={onOpenProfile}
              aria-label="User profile"
            >
              <User className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        ref={menuRef}
        className={`md:hidden ${theme === 'dark' ? 'bg-dark-bg' : 'bg-white'} shadow-lg fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className={`flex justify-between items-center p-4 border-b ${theme === 'dark' ? 'border-dark-border' : ''}`}>
          <Logo className="h-8 w-8 text-[#E60023]" />
          <button
            onClick={() => setIsMenuOpen(false)}
            className={`p-2 ${theme === 'dark' ? 'hover:bg-dark-card' : 'hover:bg-gray-100'} rounded-full transition-colors`}
          >
            <X className={`h-6 w-6 ${theme === 'dark' ? 'text-dark-text' : ''}`} />
          </button>
        </div>

        <div className="p-4">
          <form onSubmit={handleSearchSubmit} className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className={`h-5 w-5 ${theme === 'dark' ? 'text-dark-text/50' : 'text-gray-400'}`} />
            </div>
            <input
              type="text"
              className={`block w-full p-2.5 pl-10 text-sm ${
                theme === 'dark'
                  ? 'text-dark-text bg-dark-card border border-dark-border'
                  : 'text-gray-900 bg-gray-100'
              } rounded-full focus:ring-2 focus:ring-red-500 focus:outline-none`}
              placeholder="Search for ideas..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </form>

          <nav className="space-y-2">
            <button
              onClick={() => {
                onNavigate('home');
                setIsMenuOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3 rounded-full ${
                currentPage === 'home'
                  ? 'bg-[#E60023] text-white'
                  : theme === 'dark' ? 'text-dark-text hover:bg-dark-card' : 'text-gray-700 hover:bg-gray-100'
              } font-medium`}
            >
              <Home className="h-5 w-5 mr-3" />
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('explore');
                setIsMenuOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3 rounded-full ${
                currentPage === 'explore'
                  ? 'bg-[#E60023] text-white'
                  : theme === 'dark' ? 'text-dark-text hover:bg-dark-card' : 'text-gray-700 hover:bg-gray-100'
              } font-medium`}
            >
              <Compass className="h-5 w-5 mr-3" />
              Explore
            </button>
            <button
              onClick={() => {
                onOpenCreatePin();
                setIsMenuOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3 rounded-full ${theme === 'dark' ? 'text-dark-text hover:bg-dark-card' : 'text-gray-700 hover:bg-gray-100'} font-medium`}
            >
              <Plus className="h-5 w-5 mr-3" />
              Create
            </button>
            <button
              onClick={() => {
                onOpenNotifications();
                setIsMenuOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3 rounded-full ${theme === 'dark' ? 'text-dark-text hover:bg-dark-card' : 'text-gray-700 hover:bg-gray-100'} font-medium`}
            >
              <Bell className="h-5 w-5 mr-3" />
              Notifications
            </button>
            <button
              onClick={() => {
                onOpenMessages();
                setIsMenuOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3 rounded-full ${theme === 'dark' ? 'text-dark-text hover:bg-dark-card' : 'text-gray-700 hover:bg-gray-100'} font-medium`}
            >
              <MessageCircle className="h-5 w-5 mr-3" />
              Messages
            </button>
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center px-4 py-3 rounded-full ${theme === 'dark' ? 'text-dark-text hover:bg-dark-card' : 'text-gray-700 hover:bg-gray-100'} font-medium`}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 mr-3" />
              ) : (
                <Moon className="h-5 w-5 mr-3" />
              )}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;