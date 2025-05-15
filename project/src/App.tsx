import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import VirtualizedPinGrid from './components/VirtualizedPinGrid';
import PinDetailModal from './components/PinDetailModal';
import CreatePinModal from './components/CreatePinModal';
import UserProfile from './components/UserProfile';
import SearchResults from './components/SearchResults';
import AuthModal from './components/AuthModal';
import NotificationsModal from './components/NotificationsModal';
import MessagesModal from './components/MessagesModal';
import ExplorePage from './components/ExplorePage';
import { pins as initialPins, categories } from './data/pins';
import { Pin } from './types';
import { useTheme } from './context/ThemeContext';
import { SearchProvider, useSearch } from './context/SearchContext';
import { useAuth } from './context/AuthContext';
import { themeClasses } from './utils/themeUtils';

// Page types
type PageType = 'home' | 'explore' | 'search';

// Wrapper component to use search context
function AppContent() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [pins, setPins] = useState<Pin[]>(initialPins);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [isPinDetailOpen, setIsPinDetailOpen] = useState(false);
  const [isCreatePinOpen, setIsCreatePinOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { theme } = useTheme();
  const { searchQuery } = useSearch();
  const { isAuthenticated, user } = useAuth();

  const filteredPins = selectedCategory === 'all'
    ? pins
    : pins.filter(pin => pin.category === selectedCategory);

  const relatedPins = selectedPin
    ? pins.filter(pin =>
        pin.id !== selectedPin.id &&
        (pin.category === selectedPin.category || Math.random() > 0.7)
      )
    : [];

  const savedPins = pins.filter(pin => pin.saved);

  const loadMorePins = useCallback(() => {
    // In a real app, this would be an API call
    // For demo purposes, we'll duplicate some pins with new IDs
    setTimeout(() => {
      if (page <= initialPins.length) {
        const newPins = initialPins.map(pin => ({
          ...pin,
          id: `${pin.id}-${page}`,
          title: `${pin.title} (${page})`,
        }));

        setPins(prevPins => [...prevPins, ...newPins]);
        setPage(prevPage => prevPage + 1);
      } else {
        setHasMore(false);
      }
    }, 1000);
  }, [page]);

  const handlePinClick = (pin: Pin) => {
    setSelectedPin(pin);
    setIsPinDetailOpen(true);
  };

  const handleSavePin = (pinId: string, saved: boolean) => {
    setPins(prevPins =>
      prevPins.map(pin =>
        pin.id === pinId ? {...pin, saved} : pin
      )
    );
  };

  const handleCreatePin = (newPin: Pin) => {
    setPins(prevPins => [newPin, ...prevPins]);
  };

  const handleOpenCreatePin = () => {
    if (isAuthenticated) {
      setIsCreatePinOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleOpenNotifications = () => {
    setIsNotificationsOpen(true);
  };

  const handleOpenMessages = () => {
    setIsMessagesOpen(true);
  };

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);

    // Reset search if navigating away from search page
    if (page !== 'search' && searchQuery) {
      // We don't actually clear the search query here to preserve it
      // in case the user navigates back to search
    }
  };

  // Enhanced animations with CSS classes
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes slideDown {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out forwards;
      }

      .animate-slideDown {
        animation: slideDown 0.2s ease-out forwards;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className={`min-h-screen ${themeClasses.bg(theme)} ${theme === 'dark' ? 'text-dark-text' : ''}`}>
      <Header
        onOpenCreatePin={handleOpenCreatePin}
        onOpenProfile={() => isAuthenticated ? setIsProfileOpen(true) : setIsAuthModalOpen(true)}
        onOpenNotifications={handleOpenNotifications}
        onOpenMessages={handleOpenMessages}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />

      {/* Conditionally render content based on current page */}
      {searchQuery ? (
        <SearchResults
          onPinClick={handlePinClick}
          onSavePin={handleSavePin}
        />
      ) : currentPage === 'explore' ? (
        <ExplorePage
          onPinClick={handlePinClick}
          onSavePin={handleSavePin}
        />
      ) : (
        <main className="pt-4 pb-12">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <VirtualizedPinGrid
            pins={filteredPins}
            onPinClick={handlePinClick}
            onSavePin={handleSavePin}
            onLoadMore={loadMorePins}
            hasMore={hasMore}
          />
        </main>
      )}

      {/* Modals */}
      <PinDetailModal
        pin={selectedPin}
        isOpen={isPinDetailOpen}
        onClose={() => setIsPinDetailOpen(false)}
        relatedPins={relatedPins}
      />

      <CreatePinModal
        isOpen={isCreatePinOpen}
        onClose={() => setIsCreatePinOpen(false)}
        onCreatePin={handleCreatePin}
      />

      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        savedPins={savedPins}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Messages Modal */}
      <MessagesModal
        isOpen={isMessagesOpen}
        onClose={() => setIsMessagesOpen(false)}
      />
    </div>
  );
}

// Main App component that provides the search context
function App() {
  return (
    <SearchProvider pins={initialPins}>
      <AppContent />
    </SearchProvider>
  );
}

export default App;