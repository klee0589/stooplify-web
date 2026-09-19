import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const FAQ_ITEMS = [
  { q: 'When do Bed-Stuy stoop sales happen?', a: 'Bed-Stuy stoop sales are most common on Saturday and Sunday mornings from 8am to 2pm, especially from April through October. The neighborhood\'s tree-lined brownstone blocks make for a pleasant weekend treasure hunt.' },
  { q: 'What streets in Bed-Stuy have the best stoop sales?', a: 'Look along Fulton Street, Lewis Avenue, Malcolm X Boulevard, and the side streets off Jefferson Avenue. Halsey Street and MacDonough Street are also popular, particularly the blocks with well-preserved brownstones.' },
  { q: 'What do people sell at Bed-Stuy stoop sales?', a: 'Bed-Stuy sellers offer a wonderful mix of antiques, vintage furniture, brownstone-era finds, vinyl records, books, quality clothing, and unique home décor. The neighborhood\'s long history means you can find genuine vintage and antique pieces.' },
  { q: 'How do I find Bed-Stuy stoop sales this weekend?', a: 'The easiest way is to use Stooplify — browse the interactive map, filter by neighborhood, and see all upcoming Bed-Stuy stoop and yard sales posted by local sellers.' },
];

const NEARBY = [
  { label: 'Bushwick Stoop Sales', url: '/stoop-sales-bushwick' },
  { label: 'Brooklyn Stoop Sales', url: '/stoop-sales-brooklyn' },
  { label: 'Williamsburg Stoop Sales', url: '/stoop-sales-williamsburg' },
  { label: 'Crown Heights Stoop Sales', url: '/stoop-sales-brooklyn' },
];

export default function StoopSalesBedStuy() {
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
        { '@type': 'ListItem', position: 3, name: 'Bed-Stuy Stoop Sales', item: 'https://stooplify.com/stoop-sales-bed-stuy' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title="Bed-Stuy Stoop Sales — Yard Sales in Bedford-Stuyvesant Brooklyn This Weekend | Stooplify"
        description="Browse upcoming stoop sales in Bed-Stuy (Bedford-Stuyvesant), Brooklyn. Find antiques, vintage furniture, records, books & more. Live map updated every weekend."
        keywords="Bed-Stuy stoop sales, Bedford-Stuyvesant stoop sale, Bed-Stuy yard sales, stoop sales Bed-Stuy this weekend, Bed-Stuy Brooklyn garage sales"
        url="https://stooplify.com/stoop-sales-bed-stuy"
        structuredData={structuredData}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-16">
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-[#14B8FF] transition-colors">Home</Link>
          <span>›</span>
          <Link to="/stoop-sales-brooklyn" className="hover:text-[#14B8FF] transition-colors">Brooklyn</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-medium">Bed-Stuy Stoop Sales</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2E3A59] dark:text-white mb-6 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Bed-Stuy Stoop Sales
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Bedford-Stuyvesant's historic brownstones, tree-lined streets, and deep community roots make it one of Brooklyn's most rewarding neighborhoods for stoop sale treasure hunting.
          </p>

          {/* Live CTA */}
          <div className="p-6 bg-gradient-to-r from-[#FF6F61] to-[#F5A623] rounded-2xl text-white mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-lg mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>🗺️ Browse Bed-Stuy Sales Live</p>
                <p className="text-white/90 text-sm">See what's happening this weekend on the interactive map.</p>
              </div>
              <Link to="/yard-sales" className="shrink-0 px-6 py-3 bg-white text-[#FF6F61] rounded-xl font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
                Browse the Map →
              </Link>
            </div>
          </div>

          <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Why Bed-Stuy Is a Stoop Sale Treasure Trove</h2>
            <p>Bedford-Stuyvesant is one of Brooklyn's most historically rich neighborhoods, with stunning brownstone architecture dating back to the late 1800s. Generations of residents have created a deep community culture where stoop sales are a weekend tradition — neighbors selling to neighbors, with genuine vintage and antique finds mixed in with everyday items.</p>
            <p>The neighborhood's long history means many sales feature items that have been in homes for decades — real vintage, not reproductions. From original brownstone hardware to mid-century furniture, Bed-Stuy stoop sales reward patient browsers.</p>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Best Streets for Bed-Stuy Stoop Sales</h2>
            <p>The highest concentration of stoop sales in Bed-Stuy happens on the neighborhood's classic residential blocks:</p>
            <ul className="list-disc pl-6 space-y-2 text-base">
              <li><strong>Fulton Street and Lewis Avenue area</strong> — busy corridors with steady seller activity</li>
              <li><strong>Malcolm X Boulevard</strong> — wide boulevard with good foot traffic and frequent sales</li>
              <li><strong>Jefferson Avenue and Halsey Street</strong> — beautiful brownstone blocks with curated selections</li>
              <li><strong>MacDonough Street and Macon Street</strong> — quieter, tree-lined blocks with quality finds</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>What You'll Find at Bed-Stuy Stoop Sales</h2>
            <p>Bed-Stuy's inventory reflects the neighborhood's long history and community character:</p>
            <ul className="list-disc pl-6 space-y-2 text-base">
              <li><strong>Antiques and vintage furniture</strong> — genuine pieces from decades of brownstone living</li>
              <li><strong>Vinyl records, books, and media</strong> — deep collections from longtime residents</li>
              <li><strong>Quality clothing and accessories</strong> — often well-maintained vintage and designer items</li>
              <li><strong>Brownstone-era home goods</strong> — architectural salvage, hardware, and décor</li>
              <li><strong>Art, prints, and collectibles</strong> — reflecting the neighborhood's cultural heritage</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Hosting a Stoop Sale in Bed-Stuy?</h2>
            <p>List your Bed-Stuy stoop sale for free on Stooplify and reach thousands of local buyers already searching for sales in your neighborhood. Your first listing is completely free with up to 5 photos.</p>
            <p>See our guides on <Link to="/guides-advertise-yard-sale" className="text-[#14B8FF] hover:underline">how to advertise your sale</Link> and <Link to="/guides-best-time-yard-sale" className="text-[#14B8FF] hover:underline">the best time to host</Link> for maximum foot traffic.</p>
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

          <div className="mt-12 p-8 bg-gradient-to-r from-[#FF6F61] to-[#F5A623] rounded-2xl text-white text-center">
            <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Find Bed-Stuy Stoop Sales Near You</h3>
            <p className="mb-6 text-white/90">Browse the live Stooplify map — all Bed-Stuy and Brooklyn stoop sales in one place.</p>
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