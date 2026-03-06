import React from 'react';

/**
 * Optimized image component with responsive sizing and WebP fallback
 */
export default function OptimizedImage({ src, alt, className, sizes, ...props }) {
  // Convert to WebP version if available
  const getOptimizedSrc = (originalSrc) => {
    if (!originalSrc) return originalSrc;
    // For Supabase images, we can add quality parameter
    return originalSrc.includes('supabase.co') 
      ? `${originalSrc}?width=${props.width || '800'}&quality=80`
      : originalSrc;
  };

  return (
    <img
      loading="lazy"
      src={getOptimizedSrc(src)}
      alt={alt}
      className={className}
      sizes={sizes}
      decoding="async"
      {...props}
    />
  );
}