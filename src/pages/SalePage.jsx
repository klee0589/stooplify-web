import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import {
  MapPin, Calendar, Clock, Share2, ArrowRight, Navigation,
  Facebook, Twitter, Link2, Tag, Package, Sofa, Shirt, Zap, Baby, Crown, BookOpen, Dumbbell, Users
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import { toast } from 'sonner';

// Derive a URL slug from sale data
export function buildSaleSlug(sale) {
  const slugify = (s) => (s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const city = slugify(sale.city || sale.state || 'local');
  // Use general_location as neighborhood hint if available
  const hood = slugify((sale.general_location || '').split(',')[0]);
  const id = sale.id.slice(-8); // short id for uniqueness
  const parts = [city, hood, id].filter(Boolean);
  return parts.join('-');
}

export function buildSaleUrl(sale) {
  return `/sale/${buildSaleSlug(sale)}`;
}

// Map city to internal city landing pages
const CITY_PAGE_MAP = {
  'brooklyn': '/stoop-sales-brooklyn',
  'queens': '/stoop-sales-queens',
  'manhattan': '/stoop-sales-manhattan',
  'bronx': '/stoop-sales-bronx',
  'jersey city': '/stoop-sales-jersey-city',
  'los angeles': '/garage-sales-los-angeles',
  'san francisco': '/garage-sales-san-francisco',
};

const CATEGORY_ICONS = {
  general: Package, furniture: Sofa, clothing: Shirt, electronics: Zap,
  toys: Baby, antiques: Crown, books: BookOpen, sports: Dumbbell, 'multi-family': Users
};

export default function SalePage() {
  const pathname = window.location.pathname; // /sale/brooklyn-williamsburg-abc12345
  const slug = pathname.replace('/sale/', '');
  // Last segment after last hyphen group is the 8-char id
  const idMatch = slug.match(/([a-z0-9]{8,})$/);
  const shortId = idMatch ? idMatch[1] : null;

  const [copySuccess, setCopySuccess] = useState(false);

  const { data: sale, isLoading } = useQuery({
    queryKey: ['salePageSlug', shortId],
    queryFn: async () => {
      if (!shortId) return null;
      const all = await base44.entities.YardSale.list('-date', 200);
      return all.find(s => s.id.endsWith(shortId) || s.id.slice(-8) === shortId) || null;
    },
    enabled: !!shortId,
  });

  const { data: relatedSales = [] } = useQuery({
    queryKey: ['relatedSales', sale?.city, sale?.id],
    queryFn: async () => {
      if (!sale) return [];
      const now = new Date();
      const all = await base44.entities.YardSale.filter({ status: 'approved' }, '-date', 20);
      return all
        .filter(s => s.id !== sale.id && (
          s.city?.toLowerCase() === sale.city?.toLowerCase() ||
          (sale.latitude && s.latitude && Math.abs(s.latitude - sale.latitude) < 0.05 && Math.abs(s.longitude - sale.longitude) < 0.05)
        ))
        .filter(s => new Date(s.date) >= now)
        .slice(0, 4);
    },
    enabled: !!sale,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#14B8FF] border-t-transparent" />
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Sale not found</h1>
        <Link to={createPageUrl('YardSales')}><Button className="bg-[#14B8FF] text-white">Browse All Sales</Button></Link>
      </div>
    );
  }

  const photos = sale.photos || [];
  const cityLower = (sale.city || '').toLowerCase();
  const cityPage = Object.entries(CITY_PAGE_MAP).find(([k]) => cityLower.includes(k))?.[1];
  const canonicalUrl = `https://stooplify.com${buildSaleUrl(sale)}`;
  const saleTitle = sale.title || 'Yard Sale';
  const neighborhood = (sale.general_location || '').split(',')[0].trim();
  const metaTitle = `${neighborhood ? `Stoop Sale in ${neighborhood}, ` : 'Yard Sale in '}${sale.city || sale.state} | Stooplify`;
  const metaDescription = sale.description
    ? sale.description.slice(0, 155)
    : `Yard sale on ${sale.date ? format(parseISO(sale.date), 'MMMM d, yyyy') : 'soon'} in ${sale.city}, ${sale.state}. Find details, photos, map & more on Stooplify.`;

  const parseTimeTo24h = (timeStr) => {
    if (!timeStr) return '09:00:00';
    const m = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (!m) return '09:00:00';
    let h = parseInt(m[1]);
    const min = m[2];
    const period = m[3]?.toUpperCase();
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${min}:00`;
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Event",
        "name": saleTitle,
        "description": metaDescription,
        "url": canonicalUrl,
        "startDate": sale.date ? `${sale.date}T${parseTimeTo24h(sale.start_time)}-05:00` : undefined,
        "endDate": sale.date ? `${sale.date}T${parseTimeTo24h(sale.end_time)}-05:00` : undefined,
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "image": photos.length > 0 ? photos : ["https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6963ddb3a6f317a7cba3c5d6/ada49740a_Stooplify-01.png"],
        "location": {
          "@type": "Place",
          "name": sale.general_location || `${sale.city}, ${sale.state}`,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": sale.city,
            "addressRegion": sale.state,
            "addressCountry": "US",
            ...(sale.zip_code ? { "postalCode": sale.zip_code } : {})
          },
          ...(sale.latitude && sale.longitude ? { "geo": { "@type": "GeoCoordinates", "latitude": sale.latitude, "longitude": sale.longitude } } : {})
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "url": canonicalUrl
        },
        "organizer": { "@type": "Organization", "name": "Stooplify", "url": "https://stooplify.com" }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://stooplify.com" },
          { "@type": "ListItem", "position": 2, "name": "Yard Sales", "item": "https://stooplify.com/YardSales" },
          { "@type": "ListItem", "position": 3, "name": saleTitle, "item": canonicalUrl }
        ]
      }
    ]
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(canonicalUrl);
    setCopySuccess(true);
    toast.success('Link copied!');
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const shareUrl = encodeURIComponent(canonicalUrl);
  const shareText = encodeURIComponent(`Check out this yard sale: ${saleTitle}`);

  const isAddressUnlocked = () => {
    if (!sale.date) return false;
    return new Date(sale.date).toDateString() === new Date().toDateString();
  };

  const showExact = isAddressUnlocked();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEO
        title={metaTitle}
        description={metaDescription}
        keywords={`yard sale ${sale.city}, stoop sale ${neighborhood}, garage sale ${sale.city} ${sale.state}, ${(sale.categories || []).join(', ')}`}
        image={photos[0]}
        url={canonicalUrl}
        type="event"
        structuredData={structuredData}
      />

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
          <Link to="/" className="hover:text-[#14B8FF]">Home</Link>
          <span>/</span>
          <Link to={createPageUrl('YardSales')} className="hover:text-[#14B8FF]">Yard Sales</Link>
          {cityPage && (
            <>
              <span>/</span>
              <Link to={cityPage} className="hover:text-[#14B8FF]">{sale.city}</Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-200 truncate max-w-[200px]">{saleTitle}</span>
        </nav>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* LEFT: Main content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Photo Gallery */}
            <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
              {photos.length > 0 ? (
                <PhotoGallery photos={photos} title={saleTitle} />
              ) : (
                <div className="aspect-[16/9] bg-gradient-to-br from-[#14B8FF]/10 to-[#1a2842]/10 flex items-center justify-center">
                  <MapPin className="w-16 h-16 text-[#14B8FF]/30" />
                </div>
              )}
            </div>

            {/* Title + Categories */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {(sale.categories || (sale.category ? [sale.category] : [])).map(cat => {
                  const Icon = CATEGORY_ICONS[cat] || Tag;
                  return (
                    <Badge key={cat} className="bg-[#14B8FF]/10 text-[#14B8FF] flex items-center gap-1">
                      <Icon className="w-3 h-3" />{cat.replace('-', ' ')}
                    </Badge>
                  );
                })}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {saleTitle}
              </h1>
            </div>

            {/* Description */}
            {sale.description && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">About this sale</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{sale.description}</p>
              </div>
            )}

            {/* Map */}
            {sale.latitude && sale.longitude && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">Location</h2>
                <div className="h-64 rounded-xl overflow-hidden">
                  <MapContainer
                    center={[sale.latitude, sale.longitude]}
                    zoom={14}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    {showExact ? (
                      <Marker position={[sale.exact_latitude || sale.latitude, sale.exact_longitude || sale.longitude]}>
                        <Popup>{saleTitle}</Popup>
                      </Marker>
                    ) : (
                      <Circle
                        center={[sale.latitude, sale.longitude]}
                        radius={400}
                        pathOptions={{ color: '#14B8FF', fillColor: '#14B8FF', fillOpacity: 0.15 }}
                      />
                    )}
                  </MapContainer>
                </div>
                {!showExact && (
                  <p className="text-xs text-gray-400 mt-2 text-center">Approximate area shown — exact address unlocks on sale day</p>
                )}
              </div>
            )}

            {/* Share */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg flex items-center gap-2"><Share2 className="w-5 h-5" /> Share this sale</h2>
              <div className="flex flex-wrap gap-3">
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                  <Facebook className="w-4 h-4" /> Facebook
                </a>
                <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-xl text-sm font-medium hover:bg-sky-600 transition-colors">
                  <Twitter className="w-4 h-4" /> Twitter/X
                </a>
                <button onClick={handleCopyLink}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Link2 className="w-4 h-4" /> {copySuccess ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Sidebar */}
          <div className="lg:col-span-2 space-y-5">
            {/* Date / Time / Location card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#14B8FF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-[#14B8FF]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Date</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {sale.date ? format(parseISO(sale.date), 'EEEE, MMMM d, yyyy') : 'TBD'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Time</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {sale.start_time || '8:00 AM'} – {sale.end_time || '2:00 PM'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Location</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {sale.general_location || `${sale.city}, ${sale.state}`}
                  </p>
                  <p className="text-sm text-gray-500">{sale.city}, {sale.state} {sale.zip_code}</p>
                </div>
              </div>

              <Button
                onClick={() => {
                  const addr = `${sale.general_location || ''}, ${sale.city}, ${sale.state}`;
                  window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`, '_blank');
                }}
                className="w-full bg-[#14B8FF] hover:bg-[#0da3e6] text-white font-semibold flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" /> Get Directions
              </Button>

              <Link to={createPageUrl('YardSales')}>
                <Button variant="outline" className="w-full border-[#14B8FF] text-[#14B8FF] hover:bg-[#14B8FF]/5 font-semibold flex items-center justify-center gap-2 mt-2">
                  Browse All Sales <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Internal links: City + Weekend pages */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">More in {sale.city}</h3>
              <div className="space-y-2">
                {cityPage && (
                  <Link to={cityPage} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-[#14B8FF]/5 transition-colors group">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-[#14B8FF]">
                      All {sale.city} Stoop Sales
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#14B8FF]" />
                  </Link>
                )}
                <Link to="/stoop-sales-nyc-this-weekend" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-[#14B8FF]/5 transition-colors group">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-[#14B8FF]">NYC Stoop Sales This Weekend</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#14B8FF]" />
                </Link>
                <Link to="/brooklyn-stoop-sales-this-weekend" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-[#14B8FF]/5 transition-colors group">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-[#14B8FF]">Brooklyn Stoop Sales This Weekend</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#14B8FF]" />
                </Link>
                <Link to={createPageUrl('YardSales')} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-[#14B8FF]/5 transition-colors group">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-[#14B8FF]">Browse All Sales on Map</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#14B8FF]" />
                </Link>
              </div>
            </div>

            {/* Related nearby sales */}
            {relatedSales.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Nearby Upcoming Sales</h3>
                <div className="space-y-2">
                  {relatedSales.map(s => (
                    <Link key={s.id} to={buildSaleUrl(s)}
                      className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-[#14B8FF]/5 transition-colors group">
                      {s.photos?.[0] ? (
                        <img src={s.photos[0]} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-[#14B8FF] truncate">{s.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {s.date ? format(parseISO(s.date), 'MMM d') : 'TBD'}
                          <span className="mx-1">·</span>
                          <MapPin className="w-3 h-3" />
                          {(s.general_location || s.city || '').split(',')[0]}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PhotoGallery({ photos, title }) {
  const [current, setCurrent] = useState(0);
  return (
    <div>
      <div className="aspect-[16/9] relative overflow-hidden cursor-pointer" onClick={() => setCurrent(i => (i + 1) % photos.length)}>
        <img src={photos[current]} alt={title} className="w-full h-full object-cover" />
        {photos.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {current + 1} / {photos.length}
          </div>
        )}
      </div>
      {photos.length > 1 && (
        <div className="flex gap-2 p-3 overflow-x-auto">
          {photos.map((p, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === current ? 'border-[#14B8FF]' : 'border-transparent opacity-60 hover:opacity-100'}`}>
              <img src={p} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}