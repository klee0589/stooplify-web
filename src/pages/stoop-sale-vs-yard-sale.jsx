import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const FAQ_ITEMS = [
  { q: 'What is the difference between a stoop sale and a yard sale?', a: 'A stoop sale is held on the front steps or sidewalk of an urban home, common in NYC. A yard sale is held in a front or back yard, typically in suburban areas. Both involve selling secondhand items at low prices.' },
  { q: 'Is a stoop sale the same as a garage sale?', a: 'Not exactly. Garage sales use a driveway or open garage, while stoop sales use the front stoop or sidewalk. The concept — selling used items — is the same, but the setting differs based on housing type.' },
  { q: 'Which is better for sellers — a stoop sale or a yard sale?', a: 'In NYC, stoop sales work great because of high foot traffic. In suburban areas, yard or garage sales are more common. Either way, listing on Stooplify ensures online buyers find you regardless of the format.' },
  { q: 'Can I have a yard sale if I live in an apartment?', a: 'Yes! You can hold a sidewalk or stoop sale in front of your building. Get permission from your landlord or co-op board if needed, and post a free listing on Stooplify to attract buyers.' },
];

const COMPARISON = [
  { aspect: 'Location', stoop: 'Front stoop or sidewalk', yard: 'Front/back yard or driveway' },
  { aspect: 'Common in', stoop: 'NYC, urban areas', yard: 'Suburbs, towns' },
  { aspect: 'Space needed', stoop: 'Very small (a few steps)', yard: 'Larger outdoor space' },
  { aspect: 'Foot traffic', stoop: 'Very high (pedestrians pass by)', yard: 'Depends on location' },
  { aspect: 'Setup time', stoop: 'Quick — right outside your door', yard: 'More setup, signage needed' },
  { aspect: 'Items typical', stoop: 'Vintage, clothing, books, art', yard: 'Furniture, tools, household items' },
  { aspect: 'Best for', stoop: 'Urban apartment dwellers', yard: 'Homeowners with outdoor space' },
];

export default function StoopSaleVsYardSale() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": FAQ_ITEMS.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://stooplify.com" },
        { "@type": "ListItem", "position": 2, "name": "Stoop Sale vs Yard Sale", "item": "https://stooplify.com/stoop-sale-vs-yard-sale" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title="Stoop Sale vs Yard Sale vs Garage Sale — What's the Difference? | Stooplify"
        description="Stoop sale, yard sale, or garage sale — what's the difference? Learn which format is right for you and how to host any type of sale with Stooplify."
        keywords="stoop sale vs yard sale, stoop sale vs garage sale, difference between stoop sale and yard sale, what is a stoop sale, what is a yard sale"
        url="https://stooplify.com/stoop-sale-vs-yard-sale"
        structuredData={structuredData}
      />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-16">
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-[#14B8FF] transition-colors">Home</Link>
          <span>›</span>
          <Link to="/what-is-a-stoop-sale" className="hover:text-[#14B8FF] transition-colors">Stoop Sales</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-medium">Stoop Sale vs Yard Sale</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2E3A59] dark:text-white mb-6 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Stoop Sale vs. Yard Sale vs. Garage Sale
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
            The terms get used interchangeably — but there are real differences in where, how, and for whom each format works best.
          </p>

          <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-8" style={{ fontFamily: 'Poppins, sans-serif' }}>Quick Definitions</h2>
            <div className="grid gap-4">
              <div className="p-5 bg-[#FF6F61]/5 border border-[#FF6F61]/20 rounded-xl">
                <h3 className="font-bold text-[#FF6F61] mb-2">🏙️ Stoop Sale</h3>
                <p className="text-base">A sale held on the front stoop, steps, or sidewalk in front of a home. The go-to format in NYC neighborhoods like <Link to="/stoop-sales-brooklyn" className="text-[#14B8FF] hover:underline">Brooklyn</Link> and <Link to="/stoop-sales-queens" className="text-[#14B8FF] hover:underline">Queens</Link>. Perfect for urban apartment dwellers with minimal space.</p>
              </div>
              <div className="p-5 bg-[#14B8FF]/5 border border-[#14B8FF]/20 rounded-xl">
                <h3 className="font-bold text-[#14B8FF] mb-2">🌿 Yard Sale</h3>
                <p className="text-base">A sale held in the front or back yard of a home. Common in suburban areas with outdoor space. Also called a "rummage sale" in some regions.</p>
              </div>
              <div className="p-5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <h3 className="font-bold text-green-700 dark:text-green-400 mb-2">🚗 Garage Sale</h3>
                <p className="text-base">A sale held in a driveway or open garage. Popular in suburban neighborhoods where homes have attached or detached garages.</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Side-by-Side Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="text-left p-3 font-semibold text-[#2E3A59] dark:text-white">Aspect</th>
                    <th className="text-left p-3 font-semibold text-[#FF6F61]">Stoop Sale</th>
                    <th className="text-left p-3 font-semibold text-[#14B8FF]">Yard / Garage Sale</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}>
                      <td className="p-3 font-medium text-gray-700 dark:text-gray-300">{row.aspect}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">{row.stoop}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">{row.yard}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Which Should You Host?</h2>
            <p>If you live in NYC or a dense urban area — <strong>do a stoop sale.</strong> High foot traffic means buyers will find you even without heavy advertising.</p>
            <p>If you're in a suburban neighborhood with a yard or garage — <strong>go with a yard or garage sale.</strong> You'll have more space to display items and attract drive-by traffic.</p>
            <p>Either way, <Link to="/add-yard-sale" className="text-[#14B8FF] hover:underline font-semibold">listing on Stooplify is free</Link> and ensures online buyers find you regardless of format. See our guide on <Link to="/guides-advertise-yard-sale" className="text-[#14B8FF] hover:underline">how to advertise your sale</Link> for more tips.</p>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Finding Sales Near You</h2>
            <p>Whether you call it a stoop sale, yard sale, or garage sale, Stooplify lists them all. <Link to="/yard-sales" className="text-[#14B8FF] hover:underline">Browse local sales on the map →</Link></p>
          </div>

          {/* City Links */}
          <div className="mt-12 p-6 bg-blue-50 dark:bg-gray-800 rounded-2xl border border-blue-100 dark:border-gray-700">
            <h3 className="font-bold text-[#2E3A59] dark:text-white mb-4 text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>📍 Browse Sales by City</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Brooklyn', url: '/stoop-sales-brooklyn' },
                { label: 'Queens', url: '/stoop-sales-queens' },
                { label: 'Manhattan', url: '/stoop-sales-manhattan' },
                { label: 'Los Angeles', url: '/garage-sales-los-angeles' },
                { label: 'San Francisco', url: '/garage-sales-san-francisco' },
                { label: 'Yard Sales Near Me', url: '/yard-sales-near-me-this-weekend' },
              ].map(city => (
                <Link key={city.url} to={city.url} className="px-3 py-2 bg-white dark:bg-gray-700 rounded-lg text-sm text-center font-medium text-gray-700 dark:text-gray-300 hover:text-[#14B8FF] border border-gray-200 dark:border-gray-600 transition-colors">
                  {city.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Related Knowledge Hub */}
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-[#2E3A59] dark:text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>📖 More in the Stoop Sale Knowledge Hub</h3>
            <div className="space-y-2">
              {[
                { label: 'What Is a Stoop Sale?', url: '/what-is-a-stoop-sale' },
                { label: 'How to Host a Stoop Sale in NYC', url: '/how-to-host-a-stoop-sale' },
                { label: 'Best Time for Yard Sales', url: '/best-time-for-yard-sales' },
                { label: 'How to Price Items for a Yard Sale', url: '/guides-pricing-yard-sale-items' },
              ].map(link => (
                <Link key={link.url} to={link.url} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-[#14B8FF] transition-colors">
                  <span className="text-[#14B8FF]">→</span> {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
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
            <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Find or List Any Type of Local Sale</h3>
            <p className="mb-6 text-white/90">Stoop sale, yard sale, garage sale — Stooplify has them all.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/yard-sales" className="px-6 py-3 bg-white text-[#14B8FF] rounded-xl font-semibold hover:bg-gray-100 transition-colors">Browse Sales</Link>
              <Link to="/add-yard-sale" className="px-6 py-3 bg-[#FF6F61] text-white rounded-xl font-semibold hover:bg-[#e85d50] transition-colors">List Your Sale Free</Link>
            </div>
          </div>
        </motion.div>
      </article>
    </div>
  );
}