import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const FAQ_ITEMS = [
  { q: 'What is the best website to post a yard sale?', a: 'Stooplify is the best platform specifically for NYC yard sales, stoop sales, and garage sales. It\'s free to list your first sale and it\'s built for local NYC sellers — with a map, buyer alerts, and neighborhood-focused discovery.' },
  { q: 'Is it free to post a yard sale online?', a: 'Yes! Stooplify is completely free for your first listing. After that, listings are $4 each or you can upgrade to an unlimited plan for $9/month.' },
  { q: 'Should I post my garage sale on multiple platforms?', a: 'Yes — the more places you post, the more foot traffic you\'ll get. Start with Stooplify for local NYC buyers, then cross-post to Facebook neighborhood groups and Nextdoor for maximum reach.' },
  { q: 'How far in advance should I post my yard sale?', a: 'Post at least 3–5 days before your sale. This gives buyers time to plan and add it to their weekend. Posting 1–2 weeks out is even better for maximizing views.' },
];

const PLATFORMS = [
  {
    rank: 1,
    name: 'Stooplify',
    emoji: '🏆',
    badge: 'Best for NYC',
    badgeColor: 'bg-[#14B8FF] text-white',
    url: '/add-yard-sale',
    description: 'Stooplify is the #1 platform built specifically for NYC stoop sales, yard sales, and garage sales. Free to list, with an interactive map, buyer notifications, and neighborhood-level discovery.',
    pros: ['Free first listing', 'Built for NYC neighborhoods', 'Interactive map with buyer discovery', 'Instant buyer notifications', 'QR code for your sale flyer', 'Shareable sale page with photos'],
    best: 'Local NYC stoop sales, yard sales, sidewalk sales'
  },
  {
    rank: 2,
    name: 'Facebook Neighborhood Groups',
    emoji: '👥',
    badge: 'High Reach',
    badgeColor: 'bg-blue-100 text-blue-700',
    description: 'Posting in your local Facebook group (e.g., "Brooklyn Buy Nothing", "Park Slope Community", "Williamsburg NYC") can drive significant foot traffic. The key is finding the right groups for your specific neighborhood.',
    pros: ['Large local audience', 'Free to post', 'Easy to share photos', 'Can add to multiple groups'],
    best: 'Reaching existing neighborhood community members'
  },
  {
    rank: 3,
    name: 'Nextdoor',
    emoji: '🏘️',
    badge: 'Hyper-Local',
    badgeColor: 'bg-green-100 text-green-700',
    description: 'Nextdoor is a neighborhood-verified social network. Your post reaches only people in your immediate area — which means qualified, local buyers who can actually walk to your sale.',
    pros: ['Verified neighbors only', 'Hyper-local audience', 'Free to post'],
    best: 'Immediate neighborhood reach'
  },
  {
    rank: 4,
    name: 'Craigslist Garage Sales',
    emoji: '📋',
    badge: 'Classic',
    badgeColor: 'bg-gray-100 text-gray-700',
    description: 'Craigslist still has a dedicated "Garage Sales" section that many bargain hunters check regularly. It\'s free and simple, though the interface is dated and there\'s no map-based discovery.',
    pros: ['Free to post', 'Still widely used', 'Simple and fast'],
    best: 'Broad audience, especially older buyers'
  },
  {
    rank: 5,
    name: 'YardSaleSearch.com',
    emoji: '🔍',
    badge: 'National',
    badgeColor: 'bg-purple-100 text-purple-700',
    description: 'A dedicated national yard sale aggregator. Less NYC-specific but useful for getting your listing in front of deal hunters who search specifically for yard sales.',
    pros: ['Yard sale focused', 'National exposure', 'Free to list'],
    best: 'Additional national visibility'
  },
];

export default function WhereToPostYardSaleOnline() {
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
      "@type": "Article",
      "headline": "Where to Post Your Yard Sale Online — Best Sites in 2026",
      "description": "The best websites and apps to post your yard sale, stoop sale, or garage sale online in 2026. Ranked by effectiveness for NYC sellers.",
      "url": "https://stooplify.com/where-to-post-yard-sale-online",
      "publisher": { "@type": "Organization", "name": "Stooplify" }
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title="Where to Post Your Yard Sale Online — Best Sites in 2026 | Stooplify"
        description="The best websites and apps to post your yard sale, stoop sale, or garage sale online in 2026. Ranked by effectiveness for NYC sellers, with Stooplify at #1."
        keywords="where to post yard sale online, best sites to post garage sale, where to advertise stoop sale, post yard sale free, garage sale websites 2026"
        url="https://stooplify.com/where-to-post-yard-sale-online"
        structuredData={structuredData}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-16">
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-[#14B8FF] transition-colors">Home</Link>
          <span>›</span>
          <Link to="/guides" className="hover:text-[#14B8FF] transition-colors">Guides</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-medium">Where to Post Your Sale Online</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2E3A59] dark:text-white mb-6 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Where to Post Your Yard Sale Online
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
            The best websites and apps to advertise your stoop sale, yard sale, or garage sale in 2026 — ranked by what actually drives foot traffic in NYC.
          </p>

          <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Why Posting Online Matters</h2>
            <p>Word of mouth and handwritten signs still help, but <strong>most NYC stoop sale buyers find sales online</strong> — specifically by searching "stoop sales near me" or browsing dedicated sale discovery apps. Posting online before your sale can triple your foot traffic.</p>
            <p>The good news: the best platforms are all free (or nearly free). Here's where to post, ranked by effectiveness for NYC sellers.</p>
          </div>

          {/* Platform List */}
          <div className="mt-10 space-y-6">
            {PLATFORMS.map((p) => (
              <div key={p.rank} className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-300 dark:text-gray-600">#{p.rank}</span>
                    <span className="text-xl">{p.emoji}</span>
                    <h3 className="text-xl font-bold text-[#2E3A59] dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>{p.name}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.badgeColor}`}>{p.badge}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">{p.description}</p>
                <div className="mb-3">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Pros</div>
                  <div className="flex flex-wrap gap-2">
                    {p.pros.map((pro, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs">{pro}</span>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400"><strong>Best for:</strong> {p.best}</div>
                {p.url && (
                  <div className="mt-4">
                    <Link to={p.url} className="inline-block px-4 py-2 bg-[#14B8FF] text-white rounded-lg text-sm font-semibold hover:bg-[#0da3e6] transition-colors">
                      Post on Stooplify Free →
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg mt-10">
            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Our Recommendation: Post on All of Them</h2>
            <p>For maximum reach, post your sale on <strong>at least 3 platforms</strong>: Stooplify for map-based NYC buyer discovery, your local Facebook group for community reach, and Nextdoor for immediate neighbors. This takes about 15 minutes and can meaningfully increase foot traffic.</p>
            <p>Also: create a printed flyer with your sale address and a QR code linking to your Stooplify listing. Post it on nearby lampposts and building bulletin boards the day before your sale.</p>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>What to Include in Your Listing</h2>
            <ul className="list-disc pl-6 space-y-2 text-base">
              <li><strong>Date and exact time</strong> (buyers plan their morning route)</li>
              <li><strong>Address or intersection</strong> (or neighborhood if you prefer privacy)</li>
              <li><strong>Item categories</strong> — furniture, clothing, books, electronics, etc.</li>
              <li><strong>Standout items</strong> — call out any vintage, furniture, or collectibles</li>
              <li><strong>Photos</strong> — listings with photos get 3–5x more views</li>
              <li><strong>Payment methods</strong> — cash only? Venmo/Zelle accepted?</li>
            </ul>
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

          {/* Related Guides */}
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-[#2E3A59] dark:text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>📖 Related Guides</h3>
            <div className="space-y-2">
              {[
                { label: 'How to Advertise a Yard Sale in NYC', url: '/guides-advertise-yard-sale' },
                { label: 'How to Price Items for a Stoop Sale', url: '/how-to-price-items-stoop-sale' },
                { label: 'Find Stoop Sales Near You (NYC Map)', url: '/find-stoop-sales-near-you' },
                { label: 'What Is a Stoop Sale? NYC Tradition Explained', url: '/what-is-a-stoop-sale' },
              ].map(link => (
                <Link key={link.url} to={link.url} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-[#14B8FF] transition-colors">
                  <span className="text-[#14B8FF]">→</span> {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 bg-gradient-to-r from-[#FF6F61] to-[#F5A623] rounded-2xl text-white text-center">
            <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Start With Stooplify — It's Free</h3>
            <p className="mb-6 text-white/90">List your first stoop sale or yard sale on NYC's dedicated sale discovery platform. Reach thousands of local buyers for free.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/add-yard-sale" className="px-6 py-3 bg-white text-[#FF6F61] rounded-xl font-semibold hover:bg-gray-100 transition-colors">Post Your Sale Free →</Link>
              <Link to="/yard-sales" className="px-6 py-3 bg-[#2E3A59] text-white rounded-xl font-semibold hover:bg-[#1a2842] transition-colors">Browse Sales Near Me</Link>
            </div>
          </div>
        </motion.div>
      </article>
    </div>
  );
}