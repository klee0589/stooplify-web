import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const SCENARIOS = [
  {
    icon: '💰',
    title: 'Sell It',
    color: 'border-[#FF6F61] bg-[#FF6F61]/5',
    headerColor: 'text-[#FF6F61]',
    when: [
      'The item is in excellent or like-new condition',
      'It has clear resale value ($10+)',
      'You have time to coordinate pickup and payment',
      'Furniture, electronics, appliances, collectibles',
      'Brand-name clothing, shoes, or accessories',
    ]
  },
  {
    icon: '📦',
    title: 'Bundle It',
    color: 'border-[#F5A623] bg-[#F5A623]/5',
    headerColor: 'text-[#F5A623]',
    when: [
      'Small items that aren\'t worth pricing individually',
      'Similar items that go together (e.g., kids\' clothes by size)',
      'Books, DVDs, kitchen items, craft supplies',
      'Clearing a whole room or closet',
      'You want one transaction instead of many',
    ]
  },
  {
    icon: '🎁',
    title: 'Give It Away Free',
    color: 'border-green-500 bg-green-50',
    headerColor: 'text-green-600',
    when: [
      'Items didn\'t sell at your yard sale',
      'You\'re moving and need things gone this weekend',
      'Speed matters more than money',
      'Items are well-used but still functional',
      'You want to help a neighbor rather than haggle',
      'Bulky items you can\'t easily donate',
    ]
  }
];

const EXAMPLES = [
  { item: 'IKEA desk, missing one screw', recommendation: 'Give Away Free', reason: 'Hard to price, fast pickup as freebie', tag: 'free' },
  { item: 'Vintage leather jacket, good condition', recommendation: 'Sell It', reason: 'Clear resale value, worth pricing', tag: 'sell' },
  { item: '30 kids\' picture books', recommendation: 'Bundle & Sell or Give Away', reason: 'Bundle for $5–$10, or free if moving', tag: 'bundle' },
  { item: 'Working printer, old model', recommendation: 'Give Away Free', reason: 'Hard to sell tech, easy giveaway', tag: 'free' },
  { item: 'Couch in good shape', recommendation: 'Sell or Free depending on timeline', reason: 'Sell for $50–$150 if you have time; free if moving fast', tag: 'both' },
  { item: 'Leftover yard sale items at 3pm', recommendation: 'Convert to Freebie', reason: 'Clear it out before you pack up', tag: 'free' },
];

const tagColors = {
  sell: 'bg-[#FF6F61]/10 text-[#FF6F61]',
  free: 'bg-green-100 text-green-700',
  bundle: 'bg-[#F5A623]/10 text-[#F5A623]',
  both: 'bg-blue-100 text-blue-700',
};

export default function GuidesSellingVsGiving() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Selling vs. Giving Away Items: When to Sell, Bundle, or Mark Free",
    "description": "Learn when to sell items at a yard sale, bundle them, or give them away free locally using Stooplify's Freebie listings.",
    "author": { "@type": "Organization", "name": "Stooplify" },
    "publisher": { "@type": "Organization", "name": "Stooplify" },
    "url": "https://stooplify.com/guides-selling-vs-giving"
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title="Selling vs. Giving Away Items: When to Sell, Bundle, or Mark Free | Stooplify"
        description="Not sure whether to sell or give away your items? Learn when to sell at a yard sale, bundle for a deal, or post a free listing to give away items locally — including free furniture, books, and moving giveaways."
        keywords="sell or give away items, free stuff near me, give away items locally, yard sale vs freebie, free furniture pickup, curb alert, free items locally"
        url="https://stooplify.com/guides-selling-vs-giving"
        structuredData={structuredData}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-16">
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-[#14B8FF] transition-colors">Home</Link>
          <span>›</span>
          <Link to="/guides" className="hover:text-[#14B8FF] transition-colors">Guides</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-medium">Selling vs. Giving Away</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2E3A59] dark:text-white mb-5 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Selling vs. Giving Away Items: When to Sell, Bundle, or Mark Free
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
            Not every item deserves a price tag — and not everything should be given away. Here's a simple guide to deciding what to sell, what to bundle, and when to just mark it FREE.
          </p>

          {/* Three options */}
          <div className="grid md:grid-cols-3 gap-5 mb-12">
            {SCENARIOS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`p-5 rounded-2xl border-2 ${s.color}`}
              >
                <div className="text-3xl mb-2">{s.icon}</div>
                <h2 className={`text-lg font-bold mb-3 ${s.headerColor}`} style={{ fontFamily: 'Poppins, sans-serif' }}>{s.title}</h2>
                <ul className="space-y-1.5">
                  {s.when.map((w, j) => (
                    <li key={j} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-1.5">
                      <span className="mt-0.5 flex-shrink-0">•</span>{w}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Decision rule */}
          <div className="p-6 bg-[#2E3A59] text-white rounded-2xl mb-12">
            <h2 className="text-xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>The Simple Rule</h2>
            <p className="text-white/90 leading-relaxed">
              If an item is worth more than <strong>$10 and you have time</strong>, sell it. If it's under $10 or you need it gone fast, bundle it or mark it free. At the end of a yard sale, <strong>anything left becomes a Freebie</strong> — don't drag it back inside.
            </p>
          </div>

          {/* Examples table */}
          <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mb-5" style={{ fontFamily: 'Poppins, sans-serif' }}>Real-World Examples</h2>
          <div className="space-y-3 mb-12">
            {EXAMPLES.map((ex, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <span className="font-semibold text-[#2E3A59] dark:text-white text-sm">{ex.item}</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{ex.reason}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${tagColors[ex.tag]}`}>{ex.recommendation}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Internal links */}
          <div className="p-6 bg-blue-50 dark:bg-gray-800 rounded-2xl border border-blue-100 dark:border-gray-700 mb-8">
            <h3 className="font-bold text-[#2E3A59] dark:text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>📚 Related Guides</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: 'How to Post Free Stuff on Stooplify', url: '/guides-post-free-stuff' },
                { label: 'How to Price Yard Sale Items', url: '/guides-pricing-yard-sale-items' },
                { label: 'How to Host a Stoop Sale', url: '/how-to-host-a-stoop-sale' },
                { label: 'Browse Free Items Near You', url: '/free-items' },
              ].map(link => (
                <Link key={link.url} to={link.url} className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-[#14B8FF] hover:text-[#14B8FF] transition-all text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="text-[#14B8FF]">→</span>{link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/add-yard-sale" className="block p-6 bg-gradient-to-r from-[#FF6F61] to-[#F5A623] rounded-2xl text-white text-center hover:opacity-90 transition-opacity">
              <div className="text-2xl mb-2">🏷️</div>
              <div className="font-bold text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>List a Yard Sale</div>
              <div className="text-sm text-white/80 mt-1">Sell items to local buyers</div>
            </Link>
            <Link to="/add-yard-sale?type=free" className="block p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white text-center hover:opacity-90 transition-opacity">
              <div className="text-2xl mb-2">🎁</div>
              <div className="font-bold text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>Post a Freebie</div>
              <div className="text-sm text-white/80 mt-1">Give items away locally</div>
            </Link>
          </div>
        </motion.div>
      </article>
    </div>
  );
}