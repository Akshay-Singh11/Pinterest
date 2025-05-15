import React, { useEffect, useRef, useState } from 'react';

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  loadingComponent?: React.ReactNode;
  threshold?: number;
  children: React.ReactNode;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  onLoadMore,
  hasMore,
  loadingComponent = <div className="py-6 text-center text-gray-500">Loading more pins...</div>,
  threshold = 200,
  children
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoading) {
          setIsLoading(true);
          onLoadMore();
          
          // Reset loading state after a short delay
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        }
      },
      {
        rootMargin: `0px 0px ${threshold}px 0px`
      }
    );
    
    const currentRef = loaderRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [onLoadMore, hasMore, isLoading, threshold]);
  
  return (
    <div className="w-full">
      {children}
      {hasMore && (
        <div ref={loaderRef} className="w-full">
          {isLoading && loadingComponent}
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;