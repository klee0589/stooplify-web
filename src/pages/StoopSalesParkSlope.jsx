import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const FAQ_ITEMS = [
  { q: 'When do Park Slope stoop sales happen?', a: 'Park Slope stoop sales are most common on Saturday and Sunday mornings from 8am to 2pm, especially from April through October. The neighborhood sees heavy stoop sale activity on warm weekend mornings year-round.' },
  { q: 'What streets in Park Slope have the best stoop sales?', a: 'Look along the side streets between 4th and 8th Avenues, particularly on streets like Carroll, Garfield, President, Union, and Berkeley Place. 7th Avenue between Flatbush and 9th Street is also a popular stretch.' },
  { q: 'What do people sell at Park Slope stoop sales?', a: 'Park Slope sellers tend to offer a mix of vintage furniture, children\'s items (the neighborhood is very family-friendly), books, clothing, kitchenware, artwork, and Brooklyn-specific vintage finds.' },
  { q: 'How do I find Park Slope stoop sales this weekend?', a: 'The easiest way is to use Stooplify — browse the interactive map, filter by neighborhood, and see all upcoming Park Slope stoop and yard sales posted by local sellers.' },
];

const NEARBY = [
  { label: 'Prospect Heights Stoop Sales', url: '/stoop-sales-brooklyn' },
  { label: 'Brooklyn Stoop Sales', url: '/stoop-sales-brooklyn' },
  { label: 'Williamsburg Stoop Sales', url: '/stoop-sales-williamsburg' },
  { label: 'NYC Stoop Sales This Weekend', url: '/stoop-sales-nyc-this-weekend' },
];

export default function StoopSalesParkSlope() {
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
        { '@type': 'ListItem', position: 3, name: 'Park Slope Stoop Sales', item: 'https://stooplify.com/stoop-sales-park-slope' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title="Park Slope Stoop Sales — Yard Sales in Park Slope Brooklyn This Weekend | Stooplify"
        description="Browse upcoming stoop sales in Park Slope, Brooklyn. Find furniture, vintage clothing, books & more from Park Slope neighbors. Live map updated every weekend."
        keywords="Park Slope stoop sales, Park Slope yard sales, Park Slope Brooklyn stoop sale, stoop sales Park Slope this weekend, yard sales Park Slope"
        url="https://stooplify.com/stoop-sales-park-slope"
        structuredData={structuredData}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-16">
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-[#14B8FF] transition-colors">Home</Link>
          <span>›</span>
          <Link to="/stoop-sales-brooklyn" className="hover:text-[#14B8FF] transition-colors">Brooklyn</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-medium">Park Slope Stoop Sales</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2E3A59] dark:text-white mb-6 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Park Slope Stoop Sales
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            One of Brooklyn's most beloved stoop sale neighborhoods — Park Slope turns its brownstone-lined blocks into an outdoor thrift market every weekend.
          </p>

          {/* Live CTA */}
          <div className="p-6 bg-gradient-to-r from-[#FF6F61] to-[#F5A623] rounded-2xl text-white mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-lg mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>🗺️ Browse Park Slope Sales Live</p>
                <p className="text-white/90 text-sm">See what's happening this weekend on the interactive map.</p>
              </div>
              <Link to="/yard-sales" className="shrink-0 px-6 py-3 bg-white text-[#FF6F61] rounded-xl font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
                Browse the Map →
              </Link>
            </div>
          </div>

          <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Why Park Slope Is a Stoop Sale Hotspot</h2>
            <p>Park Slope is one of the best neighborhoods in Brooklyn for stoop sales. The combination of historic brownstones with front stoops, a dense residential population, and a culture of thrift and sustainability makes it a natural hub for neighborhood selling.</p>
            <p>On any given Saturday morning from April through October, you'll find multiple stoop sales within a few blocks of each other — often stretching down entire residential streets between 4th and 8th Avenues.</p>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Best Streets for Park Slope Stoop Sales</h2>
            <p>The highest concentration of stoop sales in Park Slope tends to happen on the quieter residential side streets. The best hunting grounds include:</p>
            <ul className="list-disc pl-6 space-y-2 text-base">
              <li><strong>Carroll Street, Garfield Place, President Street</strong> — classic brownstone blocks with frequent seller activity</li>
              <li><strong>Berkeley Place, Lincoln Place, St. Johns Place</strong> — popular with families clearing out kids' items</li>
              <li><strong>7th Avenue corridor</strong> — high foot traffic; sellers near the avenue draw the most walk-by buyers</li>
              <li><strong>4th to 8th Avenues cross-streets</strong> — the core of the neighborhood's residential stoop sale activity</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>What You'll Find at Park Slope Stoop Sales</h2>
            <p>Park Slope stoop sales reflect the neighborhood's eclectic, family-friendly, design-conscious character:</p>
            <ul className="list-disc pl-6 space-y-2 text-base">
              <li>Mid-century and vintage furniture — Park Slope sellers have great taste</li>
              <li>Children's clothing, toys, and gear — this is one of Brooklyn's most family-dense neighborhoods</li>
              <li>Books, vinyl records, art prints, and ceramics</li>
              <li>Quality clothing and accessories, often near-new</li>
              <li>Kitchen items, small appliances, and housewares</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Hosting a Stoop Sale in Park Slope?</h2>
            <p>List your Park Slope stoop sale for free on Stooplify and reach thousands of local buyers already searching for sales in your neighborhood. Your first listing is completely free.</p>
            <p>See our guides on <Link to="/guides-advertise-yard-sale" className="text-[#14B8FF] hover:underline">how to advertise your sale</Link> and <Link to="/guides-best-time-yard-sale" className="text-[#14B8FF] hover:underline">the best time to host</Link> for maximum foot traffic.</p>
          </div>

          {/* Nearby areas */}
          <div className="mt-12 p-6 bg-blue-50 dark:bg-gray-800 rounded-2xl border border-blue-100 dark:border-gray-700">
            <h3 className="font-bold text-[#2E3A59] dark:text-white mb-4 text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>📍 Browse More Brooklyn Stoop Sales</h3>
            <div className="grid grid-cols-2 gap-3">
              {NEARBY.map(n => (
                <Link key={n.url} to={n.url} className="px-3 py-2 bg-white dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#14B8FF] border border-gray-200 dark:border-gray-600 transition-colors">
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
            <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Find Park Slope Stoop Sales Near You</h3>
            <p className="mb-6 text-white/90">Browse the live Stooplify map — all Park Slope and Brooklyn stoop sales in one place.</p>
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