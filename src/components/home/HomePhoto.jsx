import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { HOME_IMAGES } from './homepageImagery';

// Editorial artwork is separate from photographs attached to real sale listings.
export default function HomePhoto({ image, className = '', loading = 'lazy', sizes = '100vw' }) {
  const [failed, setFailed] = useState(false);
  const photo = HOME_IMAGES[image];

  if (failed) {
    return (
      <span role="img" aria-label={photo.alt} className={`flex h-full w-full items-center justify-center bg-muted text-muted-foreground ${className}`}>
        <ImageIcon className="h-8 w-8" aria-hidden="true" />
      </span>
    );
  }

  return (
    <img
      src={photo.src}
      srcSet={`${photo.small} 480w, ${photo.src} 960w`}
      sizes={sizes}
      width={photo.width}
      height={photo.height}
      alt={photo.alt}
      loading={loading}
      fetchPriority={loading === 'eager' ? 'high' : undefined}
      decoding="async"
      data-home-photo={image}
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
