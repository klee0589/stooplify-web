import React, { useRef, useCallback } from 'react';
import { VariableSizeGrid } from 'react-window';
import { motion } from 'framer-motion';
import SaleCard from './SaleCard';

export default function VirtualSalesList({ sales, favorites, onToggleFavorite }) {
  const gridRef = useRef(null);

  // Get column count based on viewport width
  const getColumnCount = () => {
    if (typeof window === 'undefined') return 1;
    const width = window.innerWidth;
    if (width >= 1536) return 4; // xl:grid-cols-4
    if (width >= 1024) return 3; // lg:grid-cols-3
    if (width >= 640) return 2;  // sm:grid-cols-2
    return 1;
  };

  const columnCount = getColumnCount();
  const itemWidth = 100 / columnCount;
  const itemHeight = 380; // Approximate height of a SaleCard + gap

  const getColumnWidth = useCallback(
    (index) => {
      const containerWidth = gridRef.current?.parentElement?.offsetWidth || 1024;
      return (containerWidth - 24) / columnCount; // 24px for gaps and padding
    },
    [columnCount]
  );

  const getRowHeight = () => itemHeight;

  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= sales.length) return null;

    const sale = sales[index];
    return (
      <motion.div
        key={sale.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        style={{
          ...style,
          padding: '12px',
        }}
      >
        <SaleCard
          sale={sale}
          isFavorite={favorites.includes(sale.id)}
          onToggleFavorite={onToggleFavorite}
          isPast={sale.isPast}
        />
      </motion.div>
    );
  };

  return (
    <div ref={gridRef} style={{ width: '100%' }}>
      <VariableSizeGrid
        columnCount={columnCount}
        columnWidth={getColumnWidth}
        height={Math.ceil(sales.length / columnCount) * getRowHeight()}
        rowCount={Math.ceil(sales.length / columnCount)}
        rowHeight={getRowHeight}
        width={gridRef.current?.offsetWidth || (typeof window !== 'undefined' ? window.innerWidth - 32 : 1024)}
        itemData={{ sales, favorites, onToggleFavorite }}
      >
        {Cell}
      </VariableSizeGrid>
    </div>
  );
}