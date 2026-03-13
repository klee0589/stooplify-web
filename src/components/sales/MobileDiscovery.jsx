import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Calendar, Tag, ChevronDown } from 'lucide-react';

const CITY_PAGES = [
  { label: 'Brooklyn', url: '/stoop-sales-brooklyn', emoji: '🏙️' },
  { label: 'Queens', url: '/stoop-sales-queens', emoji: '🌆' },
  { label: 'Manhattan', url: '/stoop-sales-manhattan', emoji: '🗽' },
  { label: 'Bronx', url: '/stoop-sales-bronx', emoji: '🏘️' },
  { label: 'Jersey City', url: '/stoop-sales-jersey-city', emoji: '🌉' },
  { label: 'Los Angeles', url: '/garage-sales-los-angeles', emoji: '☀️' },
  { label: 'San Francisco', url: '/garage-sales-san-francisco', emoji: '🌁' },
];

const NEIGHBORHOOD_PAGES = [
  { label: 'Williamsburg', url: '/stoop-sales-williamsburg-brooklyn' },
  { label: 'Park Slope', url: '/stoop-sales-park-slope-brooklyn' },
  { label: 'Bushwick', url: '/stoop-sales-bushwick-brooklyn' },
  { label: 'Bed-Stuy', url: '/stoop-sales-bed-stuy-brooklyn' },
  { label: 'Crown Heights', url: '/stoop-sales-crown-heights-brooklyn' },
  { label: 'Greenpoint', url: '/stoop-sales-greenpoint-brooklyn' },
  { label: 'Astoria', url: '/stoop-sales-astoria-queens' },
  { label: 'Upper West Side', url: '/stoop-sales-upper-west-side-manhattan' },
  { label: 'Harlem', url: '/stoop-sales-harlem-manhattan' },
];

const DATE_PAGES = [
  { label: 'Today', url: '/yard-sales-near-me-today' },
  { label: 'This Saturday', url: '/yard-sales-near-me-saturday' },
  { label: 'This Sunday', url: '/yard-sales-near-me-sunday' },
  { label: 'This Weekend', url: '/yard-sales-near-me-this-weekend' },
  { label: 'NYC Today', url: '/stoop-sales-nyc-today' },
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

const TABS = [
  { key: 'city', label: 'City', icon: Building2, color: '#14B8FF', items: CITY_PAGES, pill: 'bg-[#14B8FF]/10 text-[#14B8FF] hover:bg-[#14B8FF] hover:text-white' },
  { key: 'neighborhood', label: 'Neighborhood', icon: MapPin, color: '#FF6F61', items: NEIGHBORHOOD_PAGES, pill: 'bg-[#FF6F61]/10 text-[#FF6F61] hover:bg-[#FF6F61] hover:text-white' },
  { key: 'date', label: 'Date', icon: Calendar, color: '#F5A623', items: DATE_PAGES, pill: 'bg-[#F5A623]/10 text-[#F5A623] hover:bg-[#F5A623] hover:text-white' },
  { key: 'category', label: 'Category', icon: Tag, color: '#a855f7', items: CATEGORY_PAGES, pill: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-500 hover:text-white' },
];

export default function MobileDiscovery() {
  const [activeTab, setActiveTab] = useState('city');

  const current = TABS.find(t => t.key === activeTab);
  const Icon = current.icon;

  return (
    <div className="md:hidden mb-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-gray-100 dark:border-gray-700">
        {TABS.map(tab => {
          const TabIcon = tab.icon;
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors border-b-2 ${
                isActive
                  ? 'border-current text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-400 dark:text-gray-500'
              }`}
              style={isActive ? { color: tab.color, borderColor: tab.color } : {}}
            >
              <TabIcon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Pills */}
      <div className="p-3 flex flex-wrap gap-2">
        {current.items.map(item => (
          <Link
            key={item.url}
            to={item.url}
            className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${current.pill}`}
          >
            {item.emoji ? `${item.emoji} ${item.label}` : item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}