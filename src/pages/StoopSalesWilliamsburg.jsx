import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const FAQ_ITEMS = [
  { q: 'When are Williamsburg stoop sales?', a: 'Williamsburg stoop sales happen year-round, with peak activity on Saturday and Sunday mornings from 8am to 2pm. Spring and fall are the busiest seasons. The neighborhood\'s high foot traffic means even winter sales can attract buyers.' },
  { q: 'Where do stoop sales happen in Williamsburg?', a: 'Look along the residential side streets off Bedford Avenue and Metropolitan Avenue — streets like N 7th, N 8th, N 9th, and the blocks between Berry Street and Driggs Ave see consistent stoop sale activity. South Williamsburg also has active selling on quieter blocks.' },
  { q: 'What do Williamsburg stoop sales sell?', a: 'Williamsburg sellers reflect the neighborhood\'s creative culture: vintage and designer clothing, vinyl records, art prints, handmade crafts, vintage furniture, unique décor, and electronics. You\'ll often find genuinely unique pieces here.' },
  { q: 'How do I find Williamsburg stoop sales this weekend?', a: 'Use Stooplify\'s live map and filter by the Williamsburg area. Sellers post their sales in advance with dates, times, and item categories so you can plan your route before you leave home.' },
];

const NEARBY = [
  { label: 'Bushwick Stoop Sales', url: '/stoop-sales-brooklyn' },
  { label: 'Brooklyn Stoop Sales', url: '/stoop-sales-brooklyn' },
  { label: 'Park Slope Stoop Sales', url: '/stoop-sales-park-slope' },
  { label: 'NYC Stoop Sales This Weekend', url: '/stoop-sales-nyc-this-weekend' },
];

export default function StoopSalesWilliamsburg() {
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
        { '@type': 'ListItem', position: 3, name: 'Williamsburg Stoop Sales', item: 'https://stooplify.com/stoop-sales-williamsburg' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title="Williamsburg Stoop Sales — Yard Sales in Williamsburg Brooklyn This Weekend | Stooplify"
        description="Browse upcoming stoop sales in Williamsburg, Brooklyn. Find vintage clothing, furniture, vinyl records & more. Live map updated every weekend — free to browse."
        keywords="Williamsburg stoop sales, Williamsburg Brooklyn stoop sale, stoop sales Williamsburg this weekend, yard sales Williamsburg Brooklyn, Williamsburg garage sales"
        url="https://stooplify.com/stoop-sales-williamsburg"
        structuredData={structuredData}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-16">
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-[#14B8FF] transition-colors">Home</Link>
          <span>›</span>
          <Link to="/stoop-sales-brooklyn" className="hover:text-[#14B8FF] transition-colors">Brooklyn</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-medium">Williamsburg Stoop Sales</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2E3A59] dark:text-white mb-6 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Williamsburg Stoop Sales
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Williamsburg's creative culture, dense foot traffic, and revolving population of renters makes it one of NYC's most active stoop sale neighborhoods — year-round.
          </p>

          {/* Live CTA */}
          <div className="p-6 bg-gradient-to-r from-[#14B8FF] to-[#2E3A59] rounded-2xl text-white mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-lg mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>🗺️ Browse Williamsburg Sales Live</p>
                <p className="text-white/90 text-sm">See every stoop sale posted near Williamsburg this weekend.</p>
              </div>
              <Link to="/yard-sales" className="shrink-0 px-6 py-3 bg-white text-[#2E3A59] rounded-xl font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
                Browse the Map →
              </Link>
            </div>
          </div>

          <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Why Williamsburg Has Great Stoop Sales</h2>
            <p>Williamsburg is unique among NYC neighborhoods for stoop sales. High renter turnover means people are always moving — and when they move, they sell. Add in the creative community's love of vintage and thrift culture, and you get a neighborhood where stoop sales are a weekly ritual, not just a seasonal event.</p>
            <p>Bedford Avenue, the neighborhood's main artery, draws buyers from across the borough. Sellers on nearby side streets benefit from constant pedestrian flow, especially on weekend mornings when the neighborhood is most active.</p>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Best Spots for Williamsburg Stoop Sales</h2>
            <p>Williamsburg stoop sales cluster in a few key zones:</p>
            <ul className="list-disc pl-6 space-y-2 text-base">
              <li><strong>North Side streets off Bedford Ave</strong> — N 7th, N 8th, N 9th, N 10th Streets are prime stoop sale territory</li>
              <li><strong>Berry Street to Driggs Avenue corridor</strong> — quieter blocks with high residential density</li>
              <li><strong>Metropolitan Ave area</strong> — busy on weekends with walk-by traffic from the Williamsburg and Marcy Ave J/M/Z stops</li>
              <li><strong>South Williamsburg</strong> — Hooper, Hewes, and Keap Streets for less-crowded, more curated finds</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>What to Expect at a Williamsburg Stoop Sale</h2>
            <p>The inventory reflects the neighborhood's creative, design-conscious residents:</p>
            <ul className="list-disc pl-6 space-y-2 text-base">
              <li><strong>Vintage and designer clothing</strong> — Williamsburg has some of the best-dressed stoop sale sellers in the city</li>
              <li><strong>Vinyl records and music equipment</strong> — the neighborhood's music culture runs deep</li>
              <li><strong>Art prints, ceramics, and handmade items</strong> — artists sell directly from their stoops</li>
              <li><strong>Mid-century and industrial furniture</strong> — sellers moving out of lofts often have unique pieces</li>
              <li><strong>Books, zines, and media</strong> — eclectic and surprising finds</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Listing a Stoop Sale in Williamsburg?</h2>
            <p>Post your Williamsburg stoop sale on Stooplify for free — reach local buyers who are already searching for sales near you. Your first listing is completely free with up to 5 photos.</p>
            <p>Read our guide on <Link to="/guides-advertise-yard-sale" className="text-[#14B8FF] hover:underline">how to advertise your stoop sale</Link> for tips on maximizing foot traffic.</p>
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
            <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Find Williamsburg Stoop Sales This Weekend</h3>
            <p className="mb-6 text-white/90">The live Stooplify map shows every Williamsburg and Brooklyn stoop sale near you.</p>
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