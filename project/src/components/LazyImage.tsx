import React, { useState, useEffect, useRef, memo } from 'react';
import { useTheme } from '../context/ThemeContext';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  placeholderColor?: string;
  onLoad?: () => void;
  priority?: boolean; // For high-priority images that should load immediately
}

// Create a shared IntersectionObserver instance
const createObserver = (rootMargin = '200px') => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  return new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          const callback = target.dataset.callback;
          if (callback && window[callback as keyof Window]) {
            (window[callback as keyof Window] as any)(target.dataset.id);
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin }
  );
};

// Singleton observer
let observer: IntersectionObserver | null = null;

// Global callback registry
const callbacks: Record<string, () => void> = {};

// Add the triggerLazyLoad function to the window object
if (typeof window !== 'undefined') {
  (window as any).triggerLazyLoad = (id: string) => {
    if (callbacks[id]) {
      callbacks[id]();
      delete callbacks[id];
    }
  };
}

function LazyImageComponent({
  src,
  alt,
  width,
  height,
  className = '',
  style = {},
  placeholderColor,
  onLoad,
  priority = false
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Load immediately if priority
  const imgRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const imageId = useRef(`img-${Math.random().toString(36).substring(2, 9)}`).current;

  // Set up intersection observer to detect when image is in viewport
  useEffect(() => {
    if (priority) return; // Skip for priority images

    if (!observer) {
      observer = createObserver();
    }

    if (observer && imgRef.current) {
      // Register callback
      callbacks[imageId] = () => setIsInView(true);

      // Set data attributes for the observer callback
      imgRef.current.dataset.id = imageId;
      imgRef.current.dataset.callback = 'triggerLazyLoad';

      observer.observe(imgRef.current);
    }

    return () => {
      if (observer && imgRef.current) {
        observer.unobserve(imgRef.current);
      }
      delete callbacks[imageId];
    };
  }, [imageId, priority]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  // Calculate aspect ratio for placeholder
  const aspectRatio = width && height ? `${width}/${height}` : undefined;

  // Determine placeholder color based on theme
  const bgColor = placeholderColor ||
    (theme === 'dark' ? 'rgba(55, 55, 55, 0.3)' : 'rgba(229, 231, 235, 0.8)');

  // Use native loading="lazy" for better performance
  return (
    <div
      ref={imgRef}
      className="relative overflow-hidden"
      style={{
        ...style,
        aspectRatio,
      }}
    >
      {/* Placeholder */}
      <div
        className={`absolute inset-0 ${isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 animate-pulse`}
        style={{ backgroundColor: bgColor }}
      />

      {/* Actual image - only load when in viewport */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          onLoad={handleImageLoad}
          loading={priority ? 'eager' : 'lazy'}
          width={width}
          height={height}
          decoding="async"
        />
      )}
    </div>
  );
}

// Create a memoized version of the component
const LazyImage = memo(LazyImageComponent);

// Add displayName for better debugging
LazyImage.displayName = 'LazyImage';

export default LazyImage;
