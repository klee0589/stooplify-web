import React, { useState, useEffect } from 'react';
import { MapPin, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import HomePhoto from './HomePhoto';

export default function HeroPhotoCard({ photos: heroPhotos = [] }) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [failedPhoto, setFailedPhoto] = useState(null);
  const livePhoto = heroPhotos[photoIndex % Math.max(heroPhotos.length, 1)];
  const showLivePhoto = livePhoto && livePhoto !== failedPhoto;

  useEffect(() => {
    if (heroPhotos.length <= 1 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = setInterval(() => setPhotoIndex(i => (i + 1) % heroPhotos.length), 7000);
    return () => clearInterval(interval);
  }, [heroPhotos.length]);

  return (
    <div className="mx-auto w-full max-w-xl lg:ml-auto">
      <div className="mb-3 flex items-center justify-between gap-3 text-xs font-medium text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-accent-warm" aria-hidden="true" /> Around the neighborhood</span>
        <span>NYC &amp; New Jersey</span>
      </div>

      <div className="grid aspect-[6/5] grid-cols-5 grid-rows-2 gap-2.5 sm:gap-3">
        <div className="relative col-span-3 row-span-2 overflow-hidden rounded-2xl bg-muted shadow-glass sm:rounded-3xl">
          {showLivePhoto ? (
            <img
              key={livePhoto}
              src={livePhoto}
              alt="Photo shared by a Stooplify sale host"
              width={600}
              height={750}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              onError={() => setFailedPhoto(livePhoto)}
              className="h-full w-full object-cover"
            />
          ) : (
            <HomePhoto image="stoop" loading="eager" sizes="(min-width: 1024px) 340px, (min-width: 640px) 345px, 58vw" />
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85 sm:text-xs">{showLivePhoto ? 'From the community' : 'The joy of a good find'}</p>
            <p className="mt-2 max-w-[12rem] font-heading text-xl font-semibold leading-tight text-white sm:text-2xl">A little wandering.<br />A great find.</p>
          </div>
        </div>

        <Link to="/furniture-yard-sales" className="group relative col-span-2 overflow-hidden rounded-2xl bg-muted shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 sm:rounded-3xl">
          <HomePhoto image="home" sizes="(min-width: 640px) 230px, 38vw" className="motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-950/80 to-transparent" />
          <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-1 p-3 text-sm font-semibold text-white sm:p-4">Furniture &amp; home <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" /></span>
        </Link>

        <Link to="/book-sales" className="group relative col-span-2 overflow-hidden rounded-2xl bg-muted shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 sm:rounded-3xl">
          <HomePhoto image="records" sizes="(min-width: 640px) 230px, 38vw" className="motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-950/80 to-transparent" />
          <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-1 p-3 text-sm font-semibold text-white sm:p-4">Books &amp; little treasures <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" /></span>
        </Link>
      </div>

      <p className="mt-3 text-right text-[11px] leading-relaxed text-muted-foreground">{showLivePhoto ? 'Side images are illustrative. Explore listings for availability.' : 'Illustrative neighborhood scenes. Explore listings for availability.'}</p>
    </div>
  );
}
