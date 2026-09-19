import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const FAQ_ITEMS = [
  { q: 'When do Carroll Gardens stoop sales happen?', a: 'Carroll Gardens stoop sales are most common on Saturday mornings from 9am to 2pm, with peak season from April through October. The neighborhood\'s family-oriented character means many sales happen on Saturday mornings when families are out and about.' },
  { q: 'What streets in Carroll Gardens have the best stoop sales?', a: 'Look along Smith Street, Court Street, and the side streets between them — particularly President Street, Carroll Street, and 2nd Place. The blocks between Henry Street and the BQE also see regular stoop sale activity.' },
  { q: 'What do people sell at Carroll Gardens stoop sales?', a: 'Carroll Gardens sellers tend to offer children\'s clothing and gear, quality kitchenware, Italian-American household goods, garden items and plants, books, and well-maintained furniture. The neighborhood\'s family-friendly character means lots of kids\' items.' },
  { q: 'How do I find Carroll Gardens stoop sales this weekend?', a: 'Use Stooplify — browse the interactive map, filter by neighborhood, and see all upcoming Carroll Gardens stoop and yard sales posted by local sellers.' },
];

const NEARBY = [
  { label: 'Park Slope Stoop Sales', url: '/stoop-sales-park-slope' },
  { label: 'Brooklyn Stoop Sales', url: '/stoop-sales-brooklyn' },
  { label: 'Williamsburg Stoop Sales', url: '/stoop-sales-williamsburg' },
  { label: 'NYC Stoop Sales This Weekend', url: '/stoop-sales-nyc-this-weekend' },
];

export default function StoopSalesCarrollGardens() {
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
        { '@type': 'ListItem', position: 3, name: 'Carroll Gardens Stoop Sales', item: 'https://stooplify.com/stoop-sales-carroll-gardens' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title="Carroll Gardens Stoop Sales — Yard Sales in Carroll Gardens Brooklyn This Weekend | Stooplify"
        description="Browse upcoming stoop sales in Carroll Gardens, Brooklyn. Find children's items, kitchenware, furniture, garden goods & more. Live map updated every weekend."
        keywords="Carroll Gardens stoop sales, Carroll Gardens yard sales, Carroll Gardens Brooklyn stoop sale, stoop sales Carroll Gardens this weekend"
        url="https://stooplify.com/stoop-sales-carroll-gardens"
        structuredData={structuredData}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-16">
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-[#14B8FF] transition-colors">Home</Link>
          <span>›</span>
          <Link to="/stoop-sales-brooklyn" className="hover:text-[#14B8FF] transition-colors">Brooklyn</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-medium">Carroll Gardens Stoop Sales</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2E3A59] dark:text-white mb-6 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Carroll Gardens Stoop Sales
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Classic Brooklyn charm, tree-lined brownstone blocks, and a family-oriented community make Carroll Gardens a delightful neighborhood for weekend stoop sale browsing.
          </p>

          {/* Live CTA */}
          <div className="p-6 bg-gradient-to-r from-[#14B8FF] to-[#2E3A59] rounded-2xl text-white mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-lg mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>🗺️ Browse Carroll Gardens Sales Live</p>
                <p className="text-white/90 text-sm">See every stoop sale posted near Carroll Gardens this weekend.</p>
              </div>
              <Link to="/yard-sales" className="shrink-0 px-6 py-3 bg-white text-[#2E3A59] rounded-xl font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
                Browse the Map →
              </Link>
            </div>
          </div>

          <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Why Carroll Gardens Is a Stoop Sale Gem</h2>
            <p>Carroll Gardens is one of Brooklyn's most charming neighborhoods, known for its deep front gardens, classic brownstones, and strong Italian-American heritage. The neighborhood's family-friendly character and tight-knit community make stoop sales a pleasant, social weekend activity.</p>
            <p>What makes Carroll Gardens special is the quality and care of the items on offer. Residents tend to be long-term, so the goods are well-maintained — and the neighborhood's gardening culture means you'll often find plants, pots, and garden tools for sale alongside the usual household items.</p>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Best Streets for Carroll Gardens Stoop Sales</h2>
            <p>Carroll Gardens stoop sales cluster around the neighborhood's two main commercial strips and the residential blocks between them:</p>
            <ul className="list-disc pl-6 space-y-2 text-base">
              <li><strong>Smith Street and Court Street corridors</strong> — the main arteries with good foot traffic</li>
              <li><strong>President Street and Carroll Street</strong> — classic brownstone blocks with frequent seller activity</li>
              <li><strong>2nd Place and 3rd Place</strong> — quieter blocks with curated, family-oriented selections</li>
              <li><strong>Henry Street to the BQE cross-streets</strong> — the residential core of the neighborhood</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>What You'll Find at Carroll Gardens Stoop Sales</h2>
            <p>Carroll Gardens' inventory reflects its family-oriented, gardening culture:</p>
            <ul className="list-disc pl-6 space-y-2 text-base">
              <li><strong>Children's clothing, toys, and gear</strong> — one of Brooklyn's most family-dense neighborhoods</li>
              <li><strong>Quality kitchenware and cookware</strong> — the neighborhood's Italian heritage means great kitchen items</li>
              <li><strong>Garden items, plants, and pots</strong> — Carroll Gardens is named for its gardens, after all</li>
              <li><strong>Well-maintained furniture</strong> — long-term residents with quality pieces</li>
              <li><strong>Books, art, and home décor</strong> — curated selections from design-conscious homeowners</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Hosting a Stoop Sale in Carroll Gardens?</h2>
            <p>List your Carroll Gardens stoop sale for free on Stooplify and reach thousands of local buyers already searching for sales in your neighborhood. Your first listing is completely free with up to 5 photos.</p>
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

          <div className="mt-12 p-8 bg-gradient-to-r from-[#14B8FF] to-[#2E3A59] rounded-2xl text-white text-center">
            <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Find Carroll Gardens Stoop Sales This Weekend</h3>
            <p className="mb-6 text-white/90">The live Stooplify map shows every Carroll Gardens and Brooklyn stoop sale near you.</p>
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