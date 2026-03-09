import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const SEASONS = [
  { season: '🌸 Spring (March–May)', rating: '⭐⭐⭐⭐⭐', desc: 'The best season. People are spring cleaning, weather is mild, and buyers are eager to get outside. Schedule your sale for a Saturday in April or May for peak results.' },
  { season: '☀️ Summer (June–August)', rating: '⭐⭐⭐⭐', desc: 'Great traffic but heat can be a factor. Start early (7–8am) to avoid the midday sun. Avoid July 4th weekend — people travel. Memorial Day and Labor Day weekends can be hit-or-miss.' },
  { season: '🍂 Fall (September–October)', rating: '⭐⭐⭐⭐', desc: 'Excellent. Cooler temperatures bring out shoppers. Back-to-school season means families are looking for deals. October is a great month before the holiday season starts.' },
  { season: '❄️ Winter (November–February)', rating: '⭐⭐', desc: 'Slower foot traffic due to cold weather. Indoor sales or well-heated garage sales can still work, especially in December before the holidays. Not ideal for stoop sales in northern cities.' },
];

const FAQ_ITEMS = [
  { q: 'What is the best time to have a yard sale?', a: 'Saturday mornings from 8am to noon are the sweet spot for yard sales. Most serious shoppers arrive early, and foot traffic peaks before lunch. Spring (April–May) and fall (September–October) are the best seasons.' },
  { q: 'What day of the week is best for a yard sale?', a: 'Saturday is the best day for a yard sale. More people are off work and actively looking for weekend activities. Sunday works too but tends to have lower turnout. Weekday sales are usually slow unless you\'re in a very busy area.' },
  { q: 'What month is best for a yard sale?', a: 'April, May, September, and October are the best months for yard sales. The weather is comfortable, people are spring cleaning or clearing out before winter, and foot traffic is high.' },
  { q: 'How long should a yard sale last?', a: 'Most successful yard sales run 5–6 hours. Opening by 8am and wrapping up by 2pm covers the peak shopping window. You can go later if you still have items to sell, but traffic drops significantly after noon.' },
  { q: 'Should I have a yard sale on a holiday weekend?', a: 'It depends. Local holidays keep people home and can boost traffic. National holidays like July 4th or Labor Day often pull people out of town. Check what\'s happening in your neighborhood first.' },
];

export default function BestTimeForYardSales() {
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
        { "@type": "ListItem", "position": 2, "name": "Best Time for Yard Sales", "item": "https://stooplify.com/best-time-for-yard-sales" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title="Best Time for a Yard Sale — Day, Month & Season Guide | Stooplify"
        description="When is the best time for a yard sale? Learn the best days, times, months, and seasons to host a yard sale or garage sale for maximum turnout and sales."
        keywords="best time for yard sale, best day for yard sale, best month for yard sale, when to have a garage sale, yard sale timing tips, best season for yard sale"
        url="https://stooplify.com/best-time-for-yard-sales"
        structuredData={structuredData}
      />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-16">
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-[#14B8FF] transition-colors">Home</Link>
          <span>›</span>
          <Link to="/guides" className="hover:text-[#14B8FF] transition-colors">Guides</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-medium">Best Time for Yard Sales</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2E3A59] dark:text-white mb-6 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Best Time for a Yard Sale
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
            Timing your yard sale right can double your foot traffic and sales. Here's everything you need to know about picking the perfect day, time, and season.
          </p>

          <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Best Day of the Week</h2>
            <div className="grid gap-3">
              {[
                { day: '🥇 Saturday', verdict: 'Best', desc: 'Highest foot traffic. Most buyers plan weekend thrifting trips. Dealers and collectors shop early.' },
                { day: '🥈 Sunday', verdict: 'Good', desc: 'Strong morning traffic. Good for multi-day sales. Combine Saturday + Sunday for best results.' },
                { day: '📉 Weekdays', verdict: 'Slow', desc: 'Lower traffic unless you\'re in a busy urban area with heavy pedestrian flow (like NYC).' },
              ].map((d, i) => (
                <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border ${d.verdict === 'Best' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : d.verdict === 'Good' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[#2E3A59] dark:text-white">{d.day}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${d.verdict === 'Best' ? 'bg-green-200 text-green-800' : d.verdict === 'Good' ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-700'}`}>{d.verdict}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{d.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Best Start Time</h2>
            <p>Open by <strong>8am</strong>. Early birds are your best buyers — they're motivated, often dealers or collectors, and willing to pay fair prices. The busiest window is typically <strong>8am–noon</strong>. After 1–2pm, traffic drops sharply and buyers expect heavy discounts.</p>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl text-sm text-yellow-800 dark:text-yellow-400">
              💡 <strong>Pro tip:</strong> List on Stooplify a week in advance so buyers can mark it on their calendar. Early awareness = early arrivals.
            </div>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Best Season for Yard Sales</h2>
            <div className="space-y-4">
              {SEASONS.map((s, i) => (
                <div key={i} className="p-5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[#2E3A59] dark:text-white">{s.season}</span>
                    <span className="text-lg">{s.rating}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Check the Calendar Before You Book</h2>
            <p>Browse <Link to="/Calendar" className="text-[#14B8FF] hover:underline">Stooplify's sale calendar</Link> to see what other sales are happening in your area. Avoid competing with too many other sales on the same day, or use the crowd to your advantage — sale clusters attract more shoppers.</p>
            <p>Also check our guide on <Link to="/guides-best-time-yard-sale" className="text-[#14B8FF] hover:underline">best days and times specifically for NYC yard sales →</Link></p>
          </div>

          {/* City Links */}
          <div className="mt-10 p-6 bg-blue-50 dark:bg-gray-800 rounded-2xl border border-blue-100 dark:border-gray-700">
            <h3 className="font-bold text-[#2E3A59] dark:text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>📍 Browse Sales Near You This Weekend</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Brooklyn Stoop Sales', url: '/stoop-sales-brooklyn' },
                { label: 'NYC This Weekend', url: '/stoop-sales-nyc-this-weekend' },
                { label: 'Yard Sales Near Me', url: '/yard-sales-near-me-this-weekend' },
                { label: 'Queens Sales', url: '/stoop-sales-queens' },
                { label: 'Los Angeles', url: '/garage-sales-los-angeles' },
                { label: 'All Upcoming Sales', url: '/yard-sales' },
              ].map(city => (
                <Link key={city.url} to={city.url} className="px-3 py-2 bg-white dark:bg-gray-700 rounded-lg text-sm text-center font-medium text-gray-700 dark:text-gray-300 hover:text-[#14B8FF] border border-gray-200 dark:border-gray-600 transition-colors">
                  {city.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Knowledge Hub Links */}
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-[#2E3A59] dark:text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>📖 More Yard Sale Guides</h3>
            <div className="space-y-2">
              {[
                { label: 'How to Host a Stoop Sale in NYC', url: '/how-to-host-a-stoop-sale' },
                { label: 'How to Price Items for a Yard Sale', url: '/guides-pricing-yard-sale-items' },
                { label: 'How to Advertise a Yard Sale', url: '/guides-advertise-yard-sale' },
                { label: 'What Is a Stoop Sale?', url: '/what-is-a-stoop-sale' },
              ].map(link => (
                <Link key={link.url} to={link.url} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-[#14B8FF] transition-colors">
                  <span className="text-[#14B8FF]">→</span> {link.label}
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
            <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Ready to Plan Your Sale?</h3>
            <p className="mb-6 text-white/90">Post your yard sale for free and get discovered by local buyers.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/add-yard-sale" className="px-6 py-3 bg-white text-[#FF6F61] rounded-xl font-semibold hover:bg-gray-100 transition-colors">List Your Sale Free →</Link>
              <Link to="/Calendar" className="px-6 py-3 bg-[#2E3A59] text-white rounded-xl font-semibold hover:bg-[#1a2842] transition-colors">View Sale Calendar</Link>
            </div>
          </div>
        </motion.div>
      </article>
    </div>
  );
}