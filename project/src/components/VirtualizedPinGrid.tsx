import React, { useState, useEffect, useRef } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import PinCard from './PinCard';
import { Pin } from '../types';
import { useTheme } from '../context/ThemeContext';
import AutoSizer from 'react-virtualized-auto-sizer';

interface VirtualizedPinGridProps {
  pins: Pin[];
  onPinClick: (pin: Pin) => void;
  onSavePin: (pinId: string, saved: boolean) => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

const VirtualizedPinGrid: React.FC<VirtualizedPinGridProps> = ({
  pins,
  onPinClick,
  onSavePin,
  onLoadMore,
  hasMore
}) => {
  const { theme } = useTheme();
  const [columnCount, setColumnCount] = useState(5);
  const loaderRef = useRef<InfiniteLoader>(null);

  // Determine column count based on viewport width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setColumnCount(1);
      } else if (width < 768) {
        setColumnCount(2);
      } else if (width < 1024) {
        setColumnCount(3);
      } else if (width < 1280) {
        setColumnCount(4);
      } else {
        setColumnCount(5);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate row count based on pins length and column count
  const rowCount = Math.ceil(pins.length / columnCount) + (hasMore ? 1 : 0);

  // Check if an item is loaded
  const isItemLoaded = (index: number) => {
    return !hasMore || index < pins.length;
  };

  // Load more items when needed
  const loadMoreItems = () => {
    if (!hasMore) return;
    onLoadMore();
  };

  // Render a grid cell
  const Cell = ({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: React.CSSProperties }) => {
    const index = rowIndex * columnCount + columnIndex;
    
    if (index >= pins.length) {
      return hasMore && columnIndex === 0 ? (
        <div style={style} className="flex justify-center items-center col-span-full py-8">
          <div className={`${theme === 'dark' ? 'text-dark-text/70' : 'text-gray-500'}`}>
            Loading more pins...
          </div>
        </div>
      ) : null;
    }

    const pin = pins[index];
    
    return (
      <div style={{
        ...style,
        padding: '8px',
      }}>
        <PinCard
          key={pin.id}
          pin={pin}
          onClick={onPinClick}
          onSave={onSavePin}
        />
      </div>
    );
  };

  return (
    <div className="w-full h-screen px-4 sm:px-6 md:px-8 mx-auto">
      <AutoSizer>
        {({ height, width }) => (
          <InfiniteLoader
            ref={loaderRef}
            isItemLoaded={isItemLoaded}
            itemCount={pins.length + (hasMore ? 1 : 0)}
            loadMoreItems={loadMoreItems}
            threshold={5}
          >
            {({ onItemsRendered, ref }) => {
              // Convert from InfiniteLoader's format to Grid's format
              const onGridItemsRendered = ({
                visibleRowStartIndex,
                visibleRowStopIndex,
                visibleColumnStartIndex,
                visibleColumnStopIndex
              }: any) => {
                const visibleStartIndex = visibleRowStartIndex * columnCount + visibleColumnStartIndex;
                const visibleStopIndex = visibleRowStopIndex * columnCount + visibleColumnStopIndex;
                
                onItemsRendered({
                  visibleStartIndex,
                  visibleStopIndex
                });
              };

              return (
                <Grid
                  ref={ref}
                  columnCount={columnCount}
                  columnWidth={width / columnCount}
                  height={height - 100} // Subtract header height
                  rowCount={rowCount}
                  rowHeight={350} // Approximate height for a pin card
                  width={width}
                  onItemsRendered={onGridItemsRendered}
                  className="scrollbar-thin"
                >
                  {Cell}
                </Grid>
              );
            }}
          </InfiniteLoader>
        )}
      </AutoSizer>
    </div>
  );
};

export default VirtualizedPinGrid;
