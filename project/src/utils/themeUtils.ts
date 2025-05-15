/**
 * Utility functions for theme-based styling
 */

/**
 * Returns the appropriate class based on the current theme
 * @param theme Current theme ('dark' or 'light')
 * @param darkClass Class to use in dark mode
 * @param lightClass Class to use in light mode
 * @returns The appropriate class based on the theme
 */
export const getThemeClass = (
  theme: string,
  darkClass: string,
  lightClass: string
): string => {
  return theme === 'dark' ? darkClass : lightClass;
};

/**
 * Common theme-based class combinations
 */
export const themeClasses = {
  // Text colors
  text: (theme: string) => getThemeClass(theme, 'text-dark-text', 'text-gray-900'),
  textSecondary: (theme: string) => getThemeClass(theme, 'text-dark-text/80', 'text-gray-600'),
  textTertiary: (theme: string) => getThemeClass(theme, 'text-dark-text/70', 'text-gray-500'),
  
  // Background colors
  bg: (theme: string) => getThemeClass(theme, 'bg-dark-bg', 'bg-white'),
  bgSecondary: (theme: string) => getThemeClass(theme, 'bg-dark-card', 'bg-gray-100'),
  
  // Hover states
  hoverBg: (theme: string) => getThemeClass(theme, 'hover:bg-dark-card', 'hover:bg-gray-100'),
  
  // Border colors
  border: (theme: string) => getThemeClass(theme, 'border-dark-border', 'border-gray-200'),
  
  // Button styles
  button: (theme: string) => `p-2.5 rounded-full ${getThemeClass(theme, 'hover:bg-dark-card text-dark-text', 'hover:bg-gray-100')} transition-colors`,
  
  // Card styles
  card: (theme: string) => getThemeClass(theme, 'bg-dark-card', 'bg-white'),
};
