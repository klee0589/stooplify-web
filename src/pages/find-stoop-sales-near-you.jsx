import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Search, Calendar, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const FAQ_ITEMS = [
  { q: 'How do I find stoop sales near me this weekend?', a: 'The easiest way is to use Stooplify — browse the interactive map, filter by your neighborhood or zip code, and see all upcoming stoop and yard sales near you. You can also filter by date to find sales happening this Saturday or Sunday.' },
  { q: 'What neighborhoods have the most stoop sales in NYC?', a: 'Brooklyn is the epicenter of stoop sales — especially Williamsburg, Park Slope, Crown Heights, Bushwick, and Bed-Stuy. Queens neighborhoods like Astoria and Jackson Heights also have active stoop sale scenes.' },
  { q: 'Are stoop sales only on weekends?', a: 'Most stoop sales happen Saturday and Sunday mornings, typically between 9am and 2pm. However, you can occasionally find weekday sales especially in summer months.' },
  { q: 'How can I get notified about new stoop sales?', a: 'Sign up for Stooplify notifications and get alerted whenever new sales are posted in your neighborhoods of interest.' },
];

const BOROUGHS = [
  { label: '🏙️ Brooklyn', url: '/stoop-sales-brooklyn', desc: 'Williamsburg, Park Slope, Bushwick & more' },
  { label: '🌆 Queens', url: '/stoop-sales-queens', desc: 'Astoria, Jackson Heights, Forest Hills' },
  { label: '🗽 Manhattan', url: '/stoop-sales-manhattan', desc: 'Upper West Side, Harlem, East Village' },
  { label: '🏘️ Bronx', url: '/stoop-sales-bronx', desc: 'Riverdale, Fordham, Pelham Bay' },
  { label: '🌉 Jersey City', url: '/stoop-sales-jersey-city', desc: 'Journal Square, Downtown, Heights' },
];

const TIPS = [
  { icon: '⏰', title: 'Arrive Early', desc: 'The best items go fast. Show up within the first 30 minutes of a sale opening.' },
  { icon: '💵', title: 'Bring Cash', desc: 'Most NYC stoop sales prefer cash. Small bills make transactions easy.' },
  { icon: '🗺️', title: 'Plan a Route', desc: 'Use Stooplify\'s map to cluster multiple nearby sales into one trip.' },
  { icon: '🤝', title: 'Negotiate Politely', desc: 'Sellers expect some haggling — a respectful offer is always welcome.' },
];

export default function FindStoopSalesNearYou() {
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
        { "@type": "ListItem", "position": 2, "name": "Find Stoop Sales Near You", "item": "https://stooplify.com/find-stoop-sales-near-you" },
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Find Stoop Sales Near You — NYC Map & Weekend Guide",
      "description": "Find stoop sales near you in NYC. Browse the interactive Stooplify map to discover yard sales, stoop sales, and garage sales in Brooklyn, Queens, Manhattan, and beyond this weekend.",
      "url": "https://stooplify.com/find-stoop-sales-near-you",
      "publisher": { "@type": "Organization", "name": "Stooplify" }
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title="Find Stoop Sales Near You — NYC Map & Weekend Guide | Stooplify"
        description="Find stoop sales near you in NYC. Browse the interactive Stooplify map to discover yard sales, stoop sales, and garage sales in Brooklyn, Queens, Manhattan, and beyond this weekend."
        keywords="stoop sales near me, find stoop sales NYC, stoop sales this weekend, yard sales near me, stoop sales Brooklyn Queens Manhattan"
        url="https://stooplify.com/find-stoop-sales-near-you"
        structuredData={structuredData}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-[#14B8FF] transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-medium">Find Stoop Sales Near You</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2E3A59] dark:text-white mb-6 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Find Stoop Sales Near You
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Your complete guide to discovering NYC stoop sales, yard sales, and garage sales — with a live map updated every week.
          </p>

          {/* Hero CTA */}
          <div className="p-6 bg-gradient-to-r from-[#14B8FF] to-[#0da3e6] rounded-2xl text-white mb-12">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-6 h-6" />
              <span className="font-bold text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>Browse the Live Sale Map</span>
            </div>
            <p className="text-white/90 mb-4">Stooplify's interactive map shows every stoop sale, yard sale, and garage sale happening near you — updated in real time.</p>
            <Link to="/yard-sales" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#14B8FF] rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Find Stoop Sales Near Me <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-8" style={{ fontFamily: 'Poppins, sans-serif' }}>How to Find Stoop Sales in NYC</h2>
            <p>New York City has one of the most vibrant secondhand sale cultures in the world. Every weekend — especially in spring and fall — dozens of <strong>stoop sales, yard sales, and sidewalk sales</strong> pop up across the five boroughs. The challenge is knowing where to look.</p>
            <p>Stooplify is the #1 platform dedicated to NYC stoop sales. Sellers post their sales with exact dates, times, neighborhoods, and item categories — so you can plan your treasure-hunting route before you even leave the house.</p>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Browse by NYC Borough</h2>
            <p>Stoop sales are concentrated in NYC's densest neighborhoods. Here's where to look by borough:</p>
          </div>

          {/* Borough Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
            {BOROUGHS.map(b => (
              <Link key={b.url} to={b.url} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#14B8FF] hover:bg-blue-50 dark:hover:bg-gray-700 transition-all group">
                <div className="font-bold text-[#2E3A59] dark:text-white group-hover:text-[#14B8FF] transition-colors">{b.label}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{b.desc}</div>
              </Link>
            ))}
          </div>

          <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>When Do NYC Stoop Sales Happen?</h2>
            <p>The stoop sale season typically runs from <strong>April through October</strong>, with peak activity on warm Saturday and Sunday mornings. Most sales start between 8am and 10am and wrap up by 2pm or 3pm.</p>
            <p>Winter stoop sales do happen but are rare. The best weekends are when the weather is clear and mild — that's when sellers are most motivated and foot traffic is highest.</p>
            <p>Check the <Link to="/Calendar" className="text-[#14B8FF] hover:underline">Stooplify calendar</Link> to see all upcoming sales organized by date.</p>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Tips for Finding the Best Deals</h2>
          </div>

          {/* Tips Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
            {TIPS.map((tip, i) => (
              <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="text-2xl mb-2">{tip.icon}</div>
                <div className="font-bold text-[#2E3A59] dark:text-white mb-1">{tip.title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{tip.desc}</div>
              </div>
            ))}
          </div>

          <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>What to Expect at a NYC Stoop Sale</h2>
            <p>Unlike organized flea markets, stoop sales are casual and personal. You're buying directly from your neighbors, which means prices are negotiable and items often have real character — vintage clothing, eclectic furniture, local art, and more.</p>
            <p>Most sellers are friendly and open to conversation. If you're not sure about a price, just ask. A polite offer is almost always welcome. Read our guide on <Link to="/what-is-a-stoop-sale" className="text-[#14B8FF] hover:underline">what a stoop sale is</Link> to learn more about the culture.</p>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Hosting Your Own Stoop Sale?</h2>
            <p>If you're thinking about hosting, <Link to="/add-yard-sale" className="text-[#14B8FF] hover:underline font-semibold">list your stoop sale on Stooplify for free</Link>. Your first listing is completely free and reaches thousands of local buyers actively searching for sales in your neighborhood.</p>
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

          {/* Related */}
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-[#2E3A59] dark:text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>📖 Related Guides</h3>
            <div className="space-y-2">
              {[
                { label: 'What Is a Stoop Sale? NYC Tradition Explained', url: '/what-is-a-stoop-sale' },
                { label: 'How to Price Items for a Stoop Sale', url: '/how-to-price-items-stoop-sale' },
                { label: 'How to Host a Stoop Sale in NYC', url: '/how-to-host-a-stoop-sale' },
                { label: 'Best Days & Times for Yard Sales', url: '/best-time-for-yard-sales' },
              ].map(link => (
                <Link key={link.url} to={link.url} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-[#14B8FF] transition-colors">
                  <span className="text-[#14B8FF]">→</span> {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 bg-gradient-to-r from-[#FF6F61] to-[#F5A623] rounded-2xl text-white text-center">
            <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Ready to Find Stoop Sales Near You?</h3>
            <p className="mb-6 text-white/90">Browse the live Stooplify map — the best way to discover NYC stoop sales this weekend.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/yard-sales" className="px-6 py-3 bg-white text-[#FF6F61] rounded-xl font-semibold hover:bg-gray-100 transition-colors">Find Stoop Sales Near Me →</Link>
              <Link to="/add-yard-sale" className="px-6 py-3 bg-[#2E3A59] text-white rounded-xl font-semibold hover:bg-[#1a2842] transition-colors">List Your Sale Free</Link>
            </div>
          </div>
        </motion.div>
      </article>
    </div>
  );
}