import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const sections = [
  {
    title: '🗺️ Yard Sale Listings by Location',
    links: [
      { label: 'Brooklyn Stoop Sales', href: '/stoop-sales-brooklyn' },
      { label: 'Queens Stoop Sales', href: '/stoop-sales-queens' },
      { label: 'Manhattan Stoop Sales', href: '/stoop-sales-manhattan' },
      { label: 'Bronx Stoop Sales', href: '/stoop-sales-bronx' },
      { label: 'Jersey City Stoop Sales', href: '/stoop-sales-jersey-city' },
      { label: 'NYC Stoop Sales This Weekend', href: '/stoop-sales-nyc-this-weekend' },
      { label: 'Brooklyn Stoop Sales This Weekend', href: '/brooklyn-stoop-sales-this-weekend' },
      { label: 'Yard Sales Near Me This Weekend', href: '/yard-sales-near-me-this-weekend' },
      { label: 'Garage Sales Los Angeles', href: '/garage-sales-los-angeles' },
      { label: 'Garage Sales San Francisco', href: '/garage-sales-san-francisco' },
    ]
  },
  {
    title: '📚 Seller & Buyer Guides',
    links: [
      { label: 'All Guides', href: '/guides' },
      { label: 'How to Advertise a Yard Sale in NYC', href: '/guides-advertise-yard-sale' },
      { label: 'Best Days & Times to Host a Yard Sale', href: '/guides-best-time-yard-sale' },
      { label: 'Do You Need a Permit in New York?', href: '/guides-permit-requirements-nyc' },
      { label: 'How to Price Items for a Yard Sale', href: '/guides-pricing-yard-sale-items' },
      { label: 'Guide for Seniors: Post a Yard Sale Online', href: '/guides-seniors-yard-sales' },
      { label: 'Where to Find Yard Sales Near You', href: '/guides-find-yard-sales' },
    ]
  },
  {
    title: '📖 Knowledge Hub',
    links: [
      { label: 'What Is a Stoop Sale?', href: '/what-is-a-stoop-sale' },
      { label: 'Stoop Sale vs Yard Sale', href: '/stoop-sale-vs-yard-sale' },
      { label: 'How to Host a Stoop Sale', href: '/how-to-host-a-stoop-sale' },
      { label: 'Best Time for Yard Sales', href: '/best-time-for-yard-sales' },
      { label: 'Find Stoop Sales Near You', href: '/find-stoop-sales-near-you' },
      { label: 'How to Price Items for a Stoop Sale', href: '/how-to-price-items-stoop-sale' },
      { label: 'Where to Post Your Yard Sale Online', href: '/where-to-post-yard-sale-online' },
    ]
  },
  {
    title: '✍️ Blog',
    links: [
      { label: 'All Blog Posts', href: '/Blog' },
    ]
  },
  {
    title: '⚡ Quick Links',
    links: [
      { label: 'Browse All Yard Sales', href: '/yard-sales' },
      { label: 'List Your Sale Free', href: '/add-yard-sale' },
      { label: 'Legal / Privacy Policy', href: '/Legal' },
    ]
  }
];

const breadcrumbData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://stooplify.com" },
    { "@type": "ListItem", "position": 2, "name": "Site Map", "item": "https://stooplify.com/site-map" },
  ]
};

export default function SiteMap() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Site Map | Stooplify"
        description="Complete site map for Stooplify. Find guides, blog posts, yard sale listings, and city pages all in one place."
        keywords="stooplify site map, yard sale guides, stoop sale pages"
        url="https://stooplify.com/site-map"
        structuredData={breadcrumbData}
      />
      <div className="max-w-5xl mx-auto">
        <h1
          className="text-4xl font-bold text-[#2E3A59] dark:text-white mb-4"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Site Map
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-12 text-lg">
          A complete directory of all pages on Stooplify to help you navigate and help search engines discover our content.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2
                className="text-xl font-bold text-[#2E3A59] dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {section.title}
              </h2>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-[#14B8FF] hover:underline text-sm flex items-center gap-1"
                    >
                      <span>→</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 p-6 bg-[#14B8FF]/5 rounded-2xl border border-[#14B8FF]/20 text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-4">Ready to find your next great deal?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/yard-sales" className="px-6 py-3 bg-[#14B8FF] text-white rounded-xl font-semibold hover:bg-[#0da3e6] transition-colors">
              Browse Yard Sales
            </Link>
            <Link to="/add-yard-sale" className="px-6 py-3 bg-[#FF6F61] text-white rounded-xl font-semibold hover:bg-[#e85d50] transition-colors">
              List Your Sale Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}