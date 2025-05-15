# Pinterest Clone

A modern, responsive Pinterest clone built with React, TypeScript, and Tailwind CSS. This project implements core Pinterest features including pin browsing, search, user profiles, and more.

<!--
Add a screenshot of your application here:
![Pinterest Clone Screenshot](screenshot.png)
-->

## 🌟 Features

- **Responsive Design**: Fully responsive layout that works on mobile, tablet, and desktop
- **Virtual Scrolling**: Optimized pin grid with virtualization for smooth scrolling through thousands of pins
- **Dark Mode**: Toggle between light and dark themes
- **User Authentication**: Sign up, login, and user profiles
- **Pin Management**: Create, save, and browse pins
- **Search Functionality**: Search for pins with suggestions and history
- **Notifications**: View and interact with notifications
- **Messaging**: Send and receive messages
- **Explore Page**: Discover pins by categories
- **Performance Optimized**: Lazy loading, debouncing, and hardware acceleration

## 🚀 Technologies Used

- **React**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Vite**: Build tool
- **react-window**: Virtualized lists
- **Lucide Icons**: Icon library
- **Context API**: State management

## 📋 Prerequisites

- Node.js (v14.0.0 or later)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pinterest-clone.git
   cd pinterest-clone
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
project/
├── public/
├── src/
│   ├── components/         # UI components
│   ├── context/            # React context providers
│   ├── data/               # Sample data
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Entry point
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 📱 Key Components

### Core Components

- **Header**: Navigation, search, and user actions
- **VirtualizedPinGrid**: Efficiently renders pins using virtualization
- **PinCard**: Individual pin display with actions
- **PinDetailModal**: Detailed view of a pin
- **UserProfile**: User profile page with saved pins
- **ExplorePage**: Category-based pin exploration
- **NotificationsModal**: User notifications interface
- **MessagesModal**: Messaging interface

### Utility Components

- **LazyImage**: Optimized image loading with IntersectionObserver
- **UserAvatar**: Consistent user avatar display
- **SearchSuggestions**: Search autocomplete functionality
- **CategoryFilter**: Filter pins by category

## 🔧 Performance Optimizations

### Image Loading
- Shared IntersectionObserver for efficient lazy loading
- Proper image placeholders
- Native browser lazy loading with `loading="lazy"`
- Image decoding optimization with `decoding="async"`

### Rendering Optimizations
- Component memoization with `React.memo`
- Event handler optimization with `useCallback`
- Proper dependency arrays for hooks
- Virtualized rendering for large lists

### UI Performance
- Hardware acceleration for animations
- Debounced search input
- Throttled scroll events
- CSS optimizations with Tailwind

## 🧩 Context Providers

- **ThemeContext**: Manages light/dark theme
- **AuthContext**: Handles user authentication
- **SearchContext**: Manages search functionality

## 🔄 State Management

The application uses React's Context API for global state management:

- User authentication state
- Theme preferences
- Search queries and history
- Pin data and interactions

## 📝 Future Improvements

- Backend integration with a real database
- User authentication with JWT
- Real-time notifications and messaging
- Image upload functionality
- Social features (following, comments)
- Mobile app with React Native

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Pinterest](https://www.pinterest.com/) for inspiration
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide Icons](https://lucide.dev/) for beautiful icons
- [React Window](https://github.com/bvaughn/react-window) for virtualization
- [Vite](https://vitejs.dev/) for the build system

---

Created with ❤️ by Pinterest Clone Team
