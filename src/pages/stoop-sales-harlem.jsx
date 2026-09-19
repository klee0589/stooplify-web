import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const FAQ_ITEMS = [
  { q: 'When do Harlem stoop sales happen?', a: 'Harlem stoop sales are most common on Saturday and Sunday mornings from 8am to 2pm, with peak season from April through October. The neighborhood\'s beautiful brownstone blocks make for a scenic weekend treasure hunt.' },
  { q: 'What streets in Harlem have the best stoop sales?', a: 'Look along Lenox Avenue (Malcolm X Boulevard), Frederick Douglass Boulevard, and the side streets off 125th Street. The blocks around Strivers\' Row, Hamilton Heights, and Mount Morris Park are particularly good for quality finds.' },
  { q: 'What do people sell at Harlem stoop sales?', a: 'Harlem sellers offer a rich mix of antiques, vintage clothing, books, vinyl records, African American cultural items, brownstone-era home goods, art, and collectibles. The neighborhood\'s deep cultural history means you can find genuinely unique pieces.' },
  { q: 'How do I find Harlem stoop sales this weekend?', a: 'The easiest way is to use Stooplify — browse the interactive map, filter by neighborhood, and see all upcoming Harlem stoop and yard sales posted by local sellers.' },
];

const NEARBY = [
  { label: 'Manhattan Stoop Sales', url: '/stoop-sales-manhattan' },
  { label: 'Bronx Stoop Sales', url: '/stoop-sales-bronx' },
  { label: 'Brooklyn Stoop Sales', url: '/stoop-sales-brooklyn' },
  { label: 'NYC Stoop Sales This Weekend', url: '/stoop-sales-nyc-this-weekend' },
];

export default function StoopSalesHarlem() {
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
        { '@type': 'ListItem', position: 2, name: 'Manhattan Stoop Sales', item: 'https://stooplify.com/stoop-sales-manhattan' },
        { '@type': 'ListItem', position: 3, name: 'Harlem Stoop Sales', item: 'https://stooplify.com/stoop-sales-harlem' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title="Harlem Stoop Sales — Yard Sales in Harlem Manhattan This Weekend | Stooplify"
        description="Browse upcoming stoop sales in Harlem, Manhattan. Find antiques, vintage clothing, records, books, cultural items & more. Live map updated every weekend."
        keywords="Harlem stoop sales, Harlem yard sales, Harlem Manhattan stoop sale, stoop sales Harlem this weekend, yard sales Harlem NYC"
        url="https://stooplify.com/stoop-sales-harlem"
        structuredData={structuredData}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-16">
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-[#14B8FF] transition-colors">Home</Link>
          <span>›</span>
          <Link to="/stoop-sales-manhattan" className="hover:text-[#14B8FF] transition-colors">Manhattan</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-medium">Harlem Stoop Sales</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2E3A59] dark:text-white mb-6 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Harlem Stoop Sales
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Harlem's rich cultural heritage, stunning brownstones, and deep community roots make its stoop sales a uniquely rewarding NYC experience — full of history, character, and genuine finds.
          </p>

          {/* Live CTA */}
          <div className="p-6 bg-gradient-to-r from-[#14B8FF] to-[#2E3A59] rounded-2xl text-white mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-lg mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>🗺️ Browse Harlem Sales Live</p>
                <p className="text-white/90 text-sm">See every stoop sale posted near Harlem this weekend.</p>
              </div>
              <Link to="/yard-sales" className="shrink-0 px-6 py-3 bg-white text-[#2E3A59] rounded-xl font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
                Browse the Map →
              </Link>
            </div>
          </div>

          <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Why Harlem Is a Stoop Sale Destination</h2>
            <p>Harlem is one of Manhattan's most culturally significant neighborhoods, with a history that spans the Harlem Renaissance, decades of artistic and musical innovation, and a deeply rooted community. This rich heritage shows up in its stoop sales, where you can find everything from vintage records and books to antique furniture and original art.</p>
            <p>The neighborhood's beautiful brownstone blocks — many dating back to the late 1800s and early 1900s — provide the perfect setting for stoop sales. Lenox Avenue and Frederick Douglass Boulevard are the main arteries, but the real treasures are found on the quieter side streets.</p>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Best Streets for Harlem Stoop Sales</h2>
            <p>Harlem stoop sales cluster around several key zones with historic brownstones and good foot traffic:</p>
            <ul className="list-disc pl-6 space-y-2 text-base">
              <li><strong>Lenox Avenue (Malcolm X Boulevard)</strong> — the main corridor with steady weekend activity</li>
              <li><strong>Frederick Douglass Boulevard</strong> — wide boulevard with frequent seller activity</li>
              <li><strong>125th Street area side streets</strong> — near the commercial heart of Harlem</li>
              <li><strong>Strivers\' Row and Hamilton Heights</strong> — historic blocks with quality, curated finds</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>What You'll Find at Harlem Stoop Sales</h2>
            <p>Harlem's inventory reflects its deep cultural heritage and long community history:</p>
            <ul className="list-disc pl-6 space-y-2 text-base">
              <li><strong>Antiques and vintage furniture</strong> — genuine pieces from decades of brownstone living</li>
              <li><strong>Vinyl records, books, and media</strong> — deep collections reflecting Harlem's musical and literary heritage</li>
              <li><strong>Vintage clothing and accessories</strong> — unique pieces with character and history</li>
              <li><strong>Art, prints, and collectibles</strong> — reflecting the neighborhood's artistic legacy</li>
              <li><strong>Brownstone-era home goods</strong> — architectural details, hardware, and period décor</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Hosting a Stoop Sale in Harlem?</h2>
            <p>List your Harlem stoop sale for free on Stooplify and reach thousands of local buyers already searching for sales in your neighborhood. Your first listing is completely free with up to 5 photos.</p>
            <p>See our guides on <Link to="/guides-advertise-yard-sale" className="text-[#14B8FF] hover:underline">how to advertise your sale</Link> and <Link to="/guides-best-time-yard-sale" className="text-[#14B8FF] hover:underline">the best time to host</Link> for maximum foot traffic.</p>
          </div>

          {/* Nearby areas */}
          <div className="mt-12 p-6 bg-blue-50 dark:bg-gray-800 rounded-2xl border border-blue-100 dark:border-gray-700">
            <h3 className="font-bold text-[#2E3A59] dark:text-white mb-4 text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>📍 More NYC Stoop Sales</h3>
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
            <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Find Harlem Stoop Sales This Weekend</h3>
            <p className="mb-6 text-white/90">The live Stooplify map shows every Harlem and Manhattan stoop sale near you.</p>
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