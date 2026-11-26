// Imported and hand-posted listings don't always carry photos. Every sale still
// needs a real image on the card and the detail page, so fall back to a curated
// yard-sale photo picked deterministically from the sale's own id.
const PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
  'https://images.unsplash.com/photo-1573408301185-9519f94bf100?w=1200&q=80',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&q=80',
  'https://images.unsplash.com/photo-1555502748-f09c63b2d3d4?w=1200&q=80',
  'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=1200&q=80',
];

export function placeholderPhoto(sale) {
  const seed = String(sale?.id || sale?.title || 'stooplify');
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  }
  return PLACEHOLDERS[hash % PLACEHOLDERS.length];
}

export function salePhotos(sale) {
  const photos = (sale?.photos || []).filter(
    (p) => typeof p === 'string' && p.startsWith('http')
  );
  return photos.length > 0 ? photos : [placeholderPhoto(sale)];
}