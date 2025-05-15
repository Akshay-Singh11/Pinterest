/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pinterest: {
          red: '#E60023',
          dark: '#cc0000',
          light: '#ff4d6a',
        },
        dark: {
          bg: '#121212',
          card: '#1e1e1e',
          text: '#e4e4e4',
          border: '#2d2d2d',
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-down': 'slideDown 0.2s ease-out forwards',
        'pulse': 'pulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    function({ addUtilities, theme, variants }) {
      const aspectRatioUtilities = {
        '.aspect-w-1': {
          paddingBottom: '100%',
          position: 'relative',
        },
        '.aspect-w-16': {
          paddingBottom: '56.25%', // 16:9 aspect ratio
          position: 'relative',
        },
        '.aspect-h-9': {
          position: 'absolute',
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
          height: '100%',
          width: '100%',
        },
      };

      addUtilities(aspectRatioUtilities, ['responsive']);
    },
  ],
};