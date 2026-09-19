import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const FAQ_ITEMS = [
  { q: 'When are Astoria stoop sales?', a: 'Astoria stoop sales happen year-round, with peak activity on Saturday and Sunday mornings from 9am to 3pm. Spring and fall are the busiest seasons, but Astoria\'s diverse community means you\'ll find sales even in winter on milder weekends.' },
  { q: 'Where do stoop sales happen in Astoria?', a: 'Look along the side streets off Steinway Street, 30th Avenue, and Broadway. Ditmars Boulevard and the blocks near Astoria Park also see regular stoop sale activity. The neighborhood\'s grid layout makes it easy to walk from sale to sale.' },
  { q: 'What do Astoria stoop sales sell?', a: 'Astoria\'s multicultural character means you\'ll find an incredible variety: Greek and Italian household goods, furniture, antiques, vintage clothing, books, international items, electronics, and unique finds from around the world.' },
  { q: 'How do I find Astoria stoop sales this weekend?', a: 'Use Stooplify\'s live map and filter by the Astoria area. Sellers post their sales in advance with dates, times, and item categories so you can plan your weekend route.' },
];

const NEARBY = [
  { label: 'Queens Stoop Sales', url: '/stoop-sales-queens' },
  { label: 'Manhattan Stoop Sales', url: '/stoop-sales-manhattan' },
  { label: 'Brooklyn Stoop Sales', url: '/stoop-sales-brooklyn' },
  { label: 'NYC Stoop Sales This Weekend', url: '/stoop-sales-nyc-this-weekend' },
];

export default function StoopSalesAstoria() {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_ITEMS.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://stooplify.com' },
        { '@type': 'ListItem', position: 2, name: 'Queens Stoop Sales', item: 'https://stooplify.com/stoop-sales-queens' },
        { '@type': 'ListItem', position: 3, name: 'Astoria Stoop Sales', item: 'https://stooplify.com/stoop-sales-astoria' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title="Astoria Stoop Sales — Yard Sales in Astoria Queens This Weekend | Stooplify"
        description="Browse upcoming stoop sales in Astoria, Queens. Find diverse international goods, furniture, antiques, clothing & more. Live map updated every weekend — free to browse."
        keywords="Astoria stoop sales, Astoria Queens stoop sale, stoop sales Astoria this weekend, yard sales Astoria Queens, Astoria garage sales"
        url="https://stooplify.com/stoop-sales-astoria"
        structuredData={structuredData}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-16">
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-[#14B8FF] transition-colors">Home</Link>
          <span>›</span>
          <Link to="/stoop-sales-queens" className="hover:text-[#14B8FF] transition-colors">Queens</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-medium">Astoria Stoop Sales</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2E3A59] dark:text-white mb-6 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Astoria Stoop Sales
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Astoria's rich multicultural heritage — Greek, Italian, and from around the world — makes its stoop sales a uniquely diverse treasure hunt in the heart of Queens.
          </p>

          {/* Live CTA */}
          <div className="p-6 bg-gradient-to-r from-[#FF6F61] to-[#F5A623] rounded-2xl text-white mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-lg mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>🗺️ Browse Astoria Sales Live</p>
                <p className="text-white/90 text-sm">See what's happening this weekend on the interactive map.</p>
              </div>
              <Link to="/yard-sales" className="shrink-0 px-6 py-3 bg-white text-[#FF6F61] rounded-xl font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
                Browse the Map →
              </Link>
            </div>
          </div>

          <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Why Astoria Is a Stoop Sale Hotspot</h2>
            <p>Astoria is one of Queens' most vibrant and diverse neighborhoods, known for its incredible food scene, strong Greek and Italian communities, and a growing population of young professionals. This multicultural mix makes Astoria stoop sales unlike any other in NYC — you never know what you'll find.</p>
            <p>The neighborhood's grid layout and walkable streets make it easy to browse multiple sales in a single morning. Steinway Street, the main commercial artery, anchors the neighborhood and draws buyers from across Queens.</p>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Best Streets for Astoria Stoop Sales</h2>
            <p>Astoria stoop sales cluster around a few key zones with high residential density:</p>
            <ul className="list-disc pl-6 space-y-2 text-base">
              <li><strong>Steinway Street side streets</strong> — the main corridor with steady foot traffic</li>
              <li><strong>30th Avenue area</strong> — vibrant stretch with frequent seller activity</li>
              <li><strong>Broadway corridor</strong> — blocks off Broadway see regular stoop sales</li>
              <li><strong>Ditmars Boulevard and Astoria Park area</strong> — quieter blocks with curated finds</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>What You'll Find at Astoria Stoop Sales</h2>
            <p>Astoria's inventory reflects its diverse, multicultural community:</p>
            <ul className="list-disc pl-6 space-y-2 text-base">
              <li><strong>International household goods</strong> — Greek, Italian, and global finds you won't see elsewhere</li>
              <li><strong>Furniture and antiques</strong> — from longtime residents with quality pieces</li>
              <li><strong>Vintage clothing and accessories</strong> — diverse styles reflecting the neighborhood's mix</li>
              <li><strong>Books, records, and media</strong> — eclectic collections from around the world</li>
              <li><strong>Kitchenware and cookware</strong> — Astoria's food culture means great kitchen items</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Hosting a Stoop Sale in Astoria?</h2>
            <p>List your Astoria stoop sale for free on Stooplify and reach thousands of local buyers already searching for sales in your neighborhood. Your first listing is completely free with up to 5 photos.</p>
            <p>Read our guide on <Link to="/guides-advertise-yard-sale" className="text-[#14B8FF] hover:underline">how to advertise your stoop sale</Link> for tips on maximizing foot traffic.</p>
          </div>

          {/* Nearby areas */}
          <div className="mt-12 p-6 bg-blue-50 dark:bg-gray-800 rounded-2xl border border-blue-100 dark:border-gray-700">
            <h3 className="font-bold text-[#2E3A59] dark:text-white mb-4 text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>📍 More Queens & NYC Stoop Sales</h3>
            <div className="grid grid-cols-2 gap-3">
              {NEARBY.map(n => (
                <Link key={n.url + n.label} to={n.url} className="px-3 py-2 bg-white dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#14B8FF] border border-gray-200 dark:border-gray-600 transition-colors">
                  {n.label}
                </Link>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>Frequently Asked Questions</h2>
            <div className="space-y-4">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="p-5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-[#2E3A59] dark:text-white mb-2">{item.q}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 p-8 bg-gradient-to-r from-[#FF6F61] to-[#F5A623] rounded-2xl text-white text-center">
            <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Find Astoria Stoop Sales Near You</h3>
            <p className="mb-6 text-white/90">Browse the live Stooplify map — all Astoria and Queens stoop sales in one place.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/yard-sales" className="px-6 py-3 bg-white text-[#FF6F61] rounded-xl font-semibold hover:bg-gray-100 transition-colors">Browse Sales →</Link>
              <Link to="/add-yard-sale" className="px-6 py-3 bg-[#2E3A59] text-white rounded-xl font-semibold hover:bg-[#1a2842] transition-colors">List Your Sale Free</Link>
            </div>
          </div>
        </motion.div>
      </article>
    </div>
  );
}