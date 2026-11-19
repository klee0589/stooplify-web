import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Calendar, Tag, ChevronDown } from 'lucide-react';

const CITY_PAGES = [
  { label: 'Brooklyn', url: '/stoop-sales-brooklyn', emoji: '🏙️' },
  { label: 'Queens', url: '/stoop-sales-queens', emoji: '🌆' },
  { label: 'Manhattan', url: '/stoop-sales-manhattan', emoji: '🗽' },
  { label: 'Bronx', url: '/stoop-sales-bronx', emoji: '🏘️' },
  { label: 'Jersey City', url: '/stoop-sales-jersey-city', emoji: '🌉' },
];

// Each neighborhood links to its one canonical URL — no duplicate paths.
const NEIGHBORHOOD_PAGES = [
  { label: 'Williamsburg', url: '/stoop-sales-williamsburg' },
  { label: 'Park Slope', url: '/stoop-sales-park-slope' },
  { label: 'Bushwick', url: '/stoop-sales-bushwick' },
  { label: 'Bed-Stuy', url: '/stoop-sales-bed-stuy' },
  { label: 'Carroll Gardens', url: '/stoop-sales-carroll-gardens' },
  { label: 'Astoria', url: '/stoop-sales-astoria' },
  { label: 'Harlem', url: '/stoop-sales-harlem' },
];

const DATE_PAGES = [
  { label: 'Today', url: '/yard-sales-near-me-today' },
  { label: 'This Weekend', url: '/yard-sales-near-me-this-weekend' },
  { label: 'NYC This Weekend', url: '/stoop-sales-nyc-this-weekend' },
];

const CATEGORY_PAGES = [
  { label: 'Furniture', url: '/furniture-yard-sales', emoji: '🛋️' },
  { label: 'Vintage Clothing', url: '/vintage-clothing-stoop-sales', emoji: '👗' },
  { label: 'Books', url: '/book-sales', emoji: '📚' },
  { label: 'Electronics', url: '/electronics-yard-sales', emoji: '💻' },
  { label: 'Antiques', url: '/antique-yard-sales', emoji: '🏺' },
  { label: 'Toys', url: '/toy-yard-sales', emoji: '🧸' },
];

const DROPDOWNS = [
  { key: 'city', label: 'City', icon: Building2, items: CITY_PAGES },
  { key: 'neighborhood', label: 'Neighborhood', icon: MapPin, items: NEIGHBORHOOD_PAGES },
  { key: 'date', label: 'Date', icon: Calendar, items: DATE_PAGES },
  { key: 'category', label: 'Category', icon: Tag, items: CATEGORY_PAGES },
];

function DropdownItem({ config }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const Icon = config.icon;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="no-min-tap flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <Icon className="w-4 h-4" />
        {config.label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 z-[200] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 min-w-[160px]">
          {config.items.map(item => (
            <Link
              key={item.url}
              to={item.url}
              onClick={() => setOpen(false)}
              className="no-min-tap block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {item.emoji ? `${item.emoji} ${item.label}` : item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DiscoveryDropdowns({ className = '' }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {DROPDOWNS.map(d => <DropdownItem key={d.key} config={d} />)}
    </div>
  );
}