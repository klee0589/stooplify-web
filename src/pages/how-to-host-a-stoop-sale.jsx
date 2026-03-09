import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const STEPS = [
  { num: '01', title: 'Pick Your Date & Time', body: 'Saturdays are best for maximum foot traffic. Aim to start by 8–9am — serious thrift shoppers arrive early. End around 2pm. Check the weather forecast and avoid holiday weekends that pull people out of town.' },
  { num: '02', title: 'Check if You Need a Permit', body: 'Most casual NYC stoop sales for personal items don\'t require a permit. Avoid blocking the sidewalk and keep noise down. Read our full guide on NYC permit requirements for details.' },
  { num: '03', title: 'Sort and Price Your Items', body: 'Go room by room. Price clothing at $1–$5, books at $1–$2, and most household items at 25–30% of retail. Use stickers or masking tape labels. Expect negotiation — it\'s part of the experience.' },
  { num: '04', title: 'Set Up Your Stoop', body: 'Use folding tables, boxes, or milk crates to display items. Group similar items together. Make clothing visible — hang it if you can. Put eye-catching items at the front to draw people in from the street.' },
  { num: '05', title: 'List on Stooplify for Free', body: 'Post your sale on Stooplify with your address (shown privately until sale day), date, time, and photos. This puts your sale on the map for local buyers actively searching your neighborhood.' },
  { num: '06', title: 'Spread the Word', body: 'Share your Stooplify listing on Instagram, WhatsApp, and local Facebook groups. Put up a sign on your block the morning of the sale. A photo of your best items gets attention fast.' },
];

const FAQ_ITEMS = [
  { q: 'How do I host a stoop sale in NYC?', a: 'Pick a date (Saturday mornings work best), sort and price your items, set up on your front stoop or sidewalk, and post a free listing on Stooplify so local buyers can find you online.' },
  { q: 'Do I need a permit to hold a stoop sale in NYC?', a: 'Generally no. Casual stoop sales for personal items are permitted in NYC without a license. Avoid blocking sidewalks and keep it a one-time or occasional event rather than a recurring business.' },
  { q: 'What should I sell at a stoop sale?', a: 'Clothing, books, household items, vintage finds, electronics, toys, furniture, and anything you no longer need. NYC buyers especially love vintage clothing, records, art, and quirky home décor.' },
  { q: 'How do I attract buyers to my stoop sale?', a: 'Post on Stooplify (free), share on social media, put up signs nearby the morning of the sale, and use photos to show off your best items. Stooplify puts your sale on the map for nearby shoppers.' },
  { q: 'What time should I start my stoop sale?', a: 'Start by 8–9am. The most motivated buyers — often dealers and collectors — arrive early. Foot traffic peaks between 9am and noon, so opening early maximizes your selling time.' },
];

export default function HowToHostAStoopSale() {
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
      "@type": "HowTo",
      "name": "How to Host a Stoop Sale in NYC",
      "step": STEPS.map((s, i) => ({
        "@type": "HowToStep",
        "position": i + 1,
        "name": s.title,
        "text": s.body
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://stooplify.com" },
        { "@type": "ListItem", "position": 2, "name": "How to Host a Stoop Sale", "item": "https://stooplify.com/how-to-host-a-stoop-sale" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title="How to Host a Stoop Sale in NYC — Step-by-Step Guide | Stooplify"
        description="Learn how to host a stoop sale in NYC with this complete step-by-step guide. From pricing to advertising, everything you need for a successful Brooklyn or Queens stoop sale."
        keywords="how to host a stoop sale, stoop sale tips, how to have a yard sale NYC, stoop sale guide, hosting a yard sale Brooklyn, stoop sale checklist"
        url="https://stooplify.com/how-to-host-a-stoop-sale"
        structuredData={structuredData}
      />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-16">
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-[#14B8FF] transition-colors">Home</Link>
          <span>›</span>
          <Link to="/what-is-a-stoop-sale" className="hover:text-[#14B8FF] transition-colors">Stoop Sales</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-medium">How to Host a Stoop Sale</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2E3A59] dark:text-white mb-6 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            How to Host a Stoop Sale in NYC
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
            A complete step-by-step guide to hosting a successful stoop sale — from picking the right day to getting buyers to show up.
          </p>

          {/* Steps */}
          <div className="space-y-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-5 p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
              >
                <div className="w-12 h-12 bg-[#FF6F61] text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {step.num}
                </div>
                <div>
                  <h3 className="font-bold text-[#2E3A59] dark:text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{step.body}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Guide cross-links */}
          <div className="mt-10 p-6 bg-blue-50 dark:bg-gray-800 rounded-2xl border border-blue-100 dark:border-gray-700">
            <h3 className="font-bold text-[#2E3A59] dark:text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>📚 Related Guides</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: 'How to Price Items for a Yard Sale', url: '/guides-pricing-yard-sale-items' },
                { label: 'Do You Need a Permit? (NYC)', url: '/guides-permit-requirements-nyc' },
                { label: 'How to Advertise a Yard Sale', url: '/guides-advertise-yard-sale' },
                { label: 'Best Days & Times for a Yard Sale', url: '/guides-best-time-yard-sale' },
              ].map(link => (
                <Link key={link.url} to={link.url} className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-[#14B8FF] hover:text-[#14B8FF] transition-all text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="text-[#14B8FF]">→</span>{link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* City links */}
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-[#2E3A59] dark:text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>📍 Popular Stoop Sale Neighborhoods</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Brooklyn', url: '/stoop-sales-brooklyn' },
                { label: 'Queens', url: '/stoop-sales-queens' },
                { label: 'Manhattan', url: '/stoop-sales-manhattan' },
                { label: 'The Bronx', url: '/stoop-sales-bronx' },
                { label: 'Jersey City', url: '/stoop-sales-jersey-city' },
                { label: 'NYC This Weekend', url: '/stoop-sales-nyc-this-weekend' },
              ].map(city => (
                <Link key={city.url} to={city.url} className="px-3 py-2 bg-white dark:bg-gray-700 rounded-lg text-sm text-center font-medium text-gray-700 dark:text-gray-300 hover:text-[#14B8FF] border border-gray-200 dark:border-gray-600 transition-colors">
                  {city.label}
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
            <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Ready to List Your Stoop Sale?</h3>
            <p className="mb-6 text-white/90">Your first listing is free. Reach local buyers in minutes.</p>
            <Link to="/add-yard-sale" className="inline-block px-8 py-4 bg-white text-[#FF6F61] rounded-xl font-bold hover:bg-gray-100 transition-colors text-lg">
              List Your Sale Free →
            </Link>
          </div>
        </motion.div>
      </article>
    </div>
  );
}