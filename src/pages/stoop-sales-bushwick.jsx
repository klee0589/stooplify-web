import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const FAQ_ITEMS = [
  { q: 'When are Bushwick stoop sales?', a: 'Bushwick stoop sales are most active on Saturday and Sunday mornings from 9am to 3pm, with peak season from April through October. The neighborhood\'s artist community means you\'ll find sales even on warmer winter weekends.' },
  { q: 'Where do stoop sales happen in Bushwick?', a: 'Look along the side streets off Myrtle Avenue, Bushwick Avenue, and Irving Avenue. Streets like Knickerbocker, Wyckoff, and Troutman see regular activity, especially near the Morgan and Jefferson L train stops.' },
  { q: 'What do people sell at Bushwick stoop sales?', a: 'Bushwick sellers reflect the neighborhood\'s creative culture: vintage and designer clothing, art prints and zines, vinyl records, industrial and mid-century furniture, plants, and unique handmade items from local artists.' },
  { q: 'How do I find Bushwick stoop sales this weekend?', a: 'Use Stooplify\'s live map and filter by the Bushwick area. Sellers post their sales in advance with dates, times, and item categories so you can plan your weekend route.' },
];

const NEARBY = [
  { label: 'Bed-Stuy Stoop Sales', url: '/stoop-sales-bed-stuy' },
  { label: 'Bushwick Stoop Sales', url: '/stoop-sales-bushwick' },
  { label: 'Williamsburg Stoop Sales', url: '/stoop-sales-williamsburg' },
  { label: 'Brooklyn Stoop Sales', url: '/stoop-sales-brooklyn' },
];

export default function StoopSalesBushwick() {
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
        { '@type': 'ListItem', position: 2, name: 'Brooklyn Stoop Sales', item: 'https://stooplify.com/stoop-sales-brooklyn' },
        { '@type': 'ListItem', position: 3, name: 'Bushwick Stoop Sales', item: 'https://stooplify.com/stoop-sales-bushwick' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title="Bushwick Stoop Sales — Yard Sales in Bushwick Brooklyn This Weekend | Stooplify"
        description="Browse upcoming stoop sales in Bushwick, Brooklyn. Find vintage clothing, art, vinyl records, furniture & more from Bushwick's creative community. Live map updated every weekend."
        keywords="Bushwick stoop sales, Bushwick yard sales, Bushwick Brooklyn stoop sale, stoop sales Bushwick this weekend, yard sales Bushwick"
        url="https://stooplify.com/stoop-sales-bushwick"
        structuredData={structuredData}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-16">
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-[#14B8FF] transition-colors">Home</Link>
          <span>›</span>
          <Link to="/stoop-sales-brooklyn" className="hover:text-[#14B8FF] transition-colors">Brooklyn</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-medium">Bushwick Stoop Sales</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2E3A59] dark:text-white mb-6 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Bushwick Stoop Sales
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Bushwick's warehouse lofts, artist community, and constant turnover of residents make it one of Brooklyn's most creative stoop sale neighborhoods — expect the unexpected.
          </p>

          {/* Live CTA */}
          <div className="p-6 bg-gradient-to-r from-[#14B8FF] to-[#2E3A59] rounded-2xl text-white mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-lg mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>🗺️ Browse Bushwick Sales Live</p>
                <p className="text-white/90 text-sm">See every stoop sale posted near Bushwick this weekend.</p>
              </div>
              <Link to="/yard-sales" className="shrink-0 px-6 py-3 bg-white text-[#2E3A59] rounded-xl font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
                Browse the Map →
              </Link>
            </div>
          </div>

          <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Why Bushwick Is a Stoop Sale Hotspot</h2>
            <p>Bushwick has transformed over the past decade into one of NYC's most vibrant creative communities. Warehouse conversions, shared studio spaces, and a revolving door of residents mean people are constantly moving — and when they move, they sell. The result is a neighborhood where stoop sales are a regular weekend occurrence, not just a seasonal event.</p>
            <p>What sets Bushwick apart is the quality and uniqueness of the finds. Many sellers are artists, designers, and musicians clearing out studios or apartments, so you'll encounter items you simply won't find anywhere else in the city.</p>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Best Streets for Bushwick Stoop Sales</h2>
            <p>Bushwick stoop sales cluster around a few key zones with high residential density and foot traffic:</p>
            <ul className="list-disc pl-6 space-y-2 text-base">
              <li><strong>Myrtle Avenue side streets</strong> — the main commercial strip draws buyers; sellers on nearby blocks benefit from the flow</li>
              <li><strong>Bushwick Avenue corridor</strong> — wider street with steady weekend activity</li>
              <li><strong>Knickerbocker and Wyckoff Avenues</strong> — near the Morgan L station, popular with younger sellers</li>
              <li><strong>Irving Avenue and Troutman Street</strong> — quieter blocks with curated, artsy selections</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>What You'll Find at Bushwick Stoop Sales</h2>
            <p>Bushwick's inventory reflects its creative, design-conscious residents:</p>
            <ul className="list-disc pl-6 space-y-2 text-base">
              <li><strong>Vintage and designer clothing</strong> — Bushwick sellers have serious style</li>
              <li><strong>Art prints, zines, and handmade crafts</strong> — artists sell directly from their stoops</li>
              <li><strong>Vinyl records and music equipment</strong> — the neighborhood's music scene runs deep</li>
              <li><strong>Industrial and mid-century furniture</strong> — loft dwellers moving out often have unique pieces</li>
              <li><strong>Plants, ceramics, and home décor</strong> — creative types with great taste</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Hosting a Stoop Sale in Bushwick?</h2>
            <p>List your Bushwick stoop sale for free on Stooplify and reach thousands of local buyers already searching for sales in your neighborhood. Your first listing is completely free with up to 5 photos.</p>
            <p>Read our guides on <Link to="/guides-advertise-yard-sale" className="text-[#14B8FF] hover:underline">how to advertise your sale</Link> and <Link to="/guides-best-time-yard-sale" className="text-[#14B8FF] hover:underline">the best time to host</Link> for maximum foot traffic.</p>
          </div>

          {/* Nearby areas */}
          <div className="mt-12 p-6 bg-blue-50 dark:bg-gray-800 rounded-2xl border border-blue-100 dark:border-gray-700">
            <h3 className="font-bold text-[#2E3A59] dark:text-white mb-4 text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>📍 More Brooklyn Stoop Sales</h3>
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

          <div className="mt-12 p-8 bg-gradient-to-r from-[#14B8FF] to-[#2E3A59] rounded-2xl text-white text-center">
            <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Find Bushwick Stoop Sales This Weekend</h3>
            <p className="mb-6 text-white/90">The live Stooplify map shows every Bushwick and Brooklyn stoop sale near you.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/yard-sales" className="px-6 py-3 bg-white text-[#14B8FF] rounded-xl font-semibold hover:bg-gray-100 transition-colors">Browse Sales →</Link>
              <Link to="/add-yard-sale" className="px-6 py-3 bg-[#FF6F61] text-white rounded-xl font-semibold hover:bg-[#e85d50] transition-colors">List Your Sale Free</Link>
            </div>
          </div>
        </motion.div>
      </article>
    </div>
  );
}