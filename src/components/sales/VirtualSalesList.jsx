import React, { useRef, useCallback, useState, useEffect } from 'react';
import { VariableSizeGrid } from 'react-window';
import { motion } from 'framer-motion';
import SaleCard from './SaleCard';

export default function VirtualSalesList({ sales, favorites, onToggleFavorite }) {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateWidth = () => {
      setContainerWidth(containerRef.current?.offsetWidth || 0);
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Get column count based on container width
  const getColumnCount = () => {
    if (containerWidth >= 1536) return 4;
    if (containerWidth >= 1024) return 3;
    if (containerWidth >= 640) return 2;
    return 1;
  };

  const columnCount = getColumnCount();
  const itemHeight = 380;

  const getColumnWidth = useCallback(
    () => (containerWidth - 24) / columnCount,
    [columnCount, containerWidth]
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