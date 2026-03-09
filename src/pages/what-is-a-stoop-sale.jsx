import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const FAQ_ITEMS = [
  { q: 'What is a stoop sale?', a: 'A stoop sale is a yard sale held on the front stoop, steps, or sidewalk of a home. They are especially popular in New York City neighborhoods like Brooklyn and Queens, where dense housing means residents sell items right outside their front doors.' },
  { q: 'How is a stoop sale different from a garage sale?', a: 'Stoop sales happen on the front steps or sidewalk of urban homes, while garage sales are held in driveways or garages typical of suburban homes. Both are great for buying and selling secondhand items at low prices.' },
  { q: 'Are stoop sales legal in NYC?', a: 'Yes. Casual stoop sales for personal items are generally permitted in NYC without a special license, as long as you do not block the sidewalk or create a public nuisance. See our permit guide for details.' },
  { q: 'How do I find stoop sales near me this weekend?', a: 'Stooplify is the best place to find stoop sales near you. Browse the interactive map, filter by neighborhood and date, and discover sales in Brooklyn, Queens, Manhattan, and beyond.' },
  { q: 'How do I host my own stoop sale?', a: 'Pick a date, set out your items on your stoop or sidewalk, post a free listing on Stooplify, and share it on social media. Read our full guide on how to host a stoop sale for step-by-step instructions.' },
];

export default function WhatIsAStoopSale() {
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
        { "@type": "ListItem", "position": 2, "name": "What Is a Stoop Sale?", "item": "https://stooplify.com/what-is-a-stoop-sale" },
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "What Is a Stoop Sale? NYC's Beloved Secondhand Tradition",
      "description": "Learn what a stoop sale is, how it differs from a yard or garage sale, and why NYC stoop sales in Brooklyn and Queens are the best way to find local deals.",
      "url": "https://stooplify.com/what-is-a-stoop-sale",
      "publisher": { "@type": "Organization", "name": "Stooplify" }
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title="What Is a Stoop Sale? NYC's Beloved Secondhand Tradition | Stooplify"
        description="Learn what a stoop sale is, how it differs from a yard or garage sale, and why NYC stoop sales in Brooklyn and Queens are the best way to find local deals."
        keywords="what is a stoop sale, stoop sale meaning, stoop sale NYC, stoop sale Brooklyn, stoop sale vs yard sale, NYC stoop sale tradition"
        url="https://stooplify.com/what-is-a-stoop-sale"
        structuredData={structuredData}
      />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-[#14B8FF] transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-medium">What Is a Stoop Sale?</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2E3A59] dark:text-white mb-6 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            What Is a Stoop Sale?
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
            A beloved New York City tradition — and one of the best ways to find secondhand treasures in your own neighborhood.
          </p>

          <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-8" style={{ fontFamily: 'Poppins, sans-serif' }}>The Simple Definition</h2>
            <p>A <strong>stoop sale</strong> is a sale held on the front stoop, steps, or sidewalk in front of a home. Sellers bring out items — furniture, clothing, books, electronics, vintage finds — and display them right outside their door for neighbors and passersby to browse and buy.</p>
            <p>The name comes from the Dutch word <em>stoep</em>, meaning "front porch" or "front step." It's a staple of NYC culture, especially popular in dense neighborhoods across Brooklyn, Queens, and Manhattan.</p>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-8" style={{ fontFamily: 'Poppins, sans-serif' }}>Why Stoop Sales Are Unique to NYC</h2>
            <p>Unlike suburban garage sales or yard sales, stoop sales happen right on the sidewalk. There's no driveway, no garage — just the front of a brownstone, apartment building, or row house. This makes them incredibly accessible for pedestrians and a natural part of the neighborhood flow.</p>
            <p>In Brooklyn neighborhoods like Williamsburg, Park Slope, Bushwick, and Crown Heights, stoop sales are a weekend ritual. You'll often find multiple sales on the same block, creating an impromptu outdoor thrift market.</p>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-8" style={{ fontFamily: 'Poppins, sans-serif' }}>What Do People Sell at Stoop Sales?</h2>
            <ul className="list-disc pl-6 space-y-2 text-base">
              <li>Furniture and home décor</li>
              <li>Vintage clothing, accessories, and shoes</li>
              <li>Books, vinyl records, and media</li>
              <li>Children's toys and baby items</li>
              <li>Electronics, cables, and small appliances</li>
              <li>Art, plants, kitchen items, and collectibles</li>
            </ul>
            <p>Basically anything you'd find at a <Link to="/yard-sales" className="text-[#14B8FF] hover:underline">local yard sale</Link> — often more curated and eclectic given NYC's creative culture.</p>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-8" style={{ fontFamily: 'Poppins, sans-serif' }}>Stoop Sale vs. Yard Sale vs. Garage Sale</h2>
            <p>These terms are often used interchangeably but there are differences. Stoop sales are urban and sidewalk-based, yard sales happen in front or back yards, and garage sales use a driveway or garage. Read our full comparison: <Link to="/stoop-sale-vs-yard-sale" className="text-[#14B8FF] hover:underline">Stoop Sale vs. Yard Sale →</Link></p>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-8" style={{ fontFamily: 'Poppins, sans-serif' }}>Want to Host Your Own Stoop Sale?</h2>
            <p>Read our step-by-step guide: <Link to="/how-to-host-a-stoop-sale" className="text-[#14B8FF] hover:underline">How to Host a Stoop Sale →</Link></p>
            <p>Or jump right in and <Link to="/add-yard-sale" className="text-[#14B8FF] hover:underline font-semibold">list your stoop sale on Stooplify for free</Link> to reach thousands of local buyers.</p>
          </div>

          {/* City Links */}
          <div className="mt-12 p-6 bg-blue-50 dark:bg-gray-800 rounded-2xl border border-blue-100 dark:border-gray-700">
            <h3 className="font-bold text-[#2E3A59] dark:text-white mb-4 text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>📍 Find Stoop Sales Near You</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Brooklyn Stoop Sales', url: '/stoop-sales-brooklyn' },
                { label: 'Queens Stoop Sales', url: '/stoop-sales-queens' },
                { label: 'Manhattan Stoop Sales', url: '/stoop-sales-manhattan' },
                { label: 'NYC This Weekend', url: '/stoop-sales-nyc-this-weekend' },
                { label: 'Bronx Sales', url: '/stoop-sales-bronx' },
                { label: 'Jersey City', url: '/stoop-sales-jersey-city' },
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
                { label: 'Stoop Sale vs. Yard Sale — What\'s the Difference?', url: '/stoop-sale-vs-yard-sale' },
                { label: 'How to Host a Stoop Sale in NYC', url: '/how-to-host-a-stoop-sale' },
                { label: 'Best Time for Yard Sales', url: '/best-time-for-yard-sales' },
                { label: 'How to Advertise a Yard Sale in NYC', url: '/guides-advertise-yard-sale' },
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

          {/* CTA */}
          <div className="mt-12 p-8 bg-gradient-to-r from-[#FF6F61] to-[#F5A623] rounded-2xl text-white text-center">
            <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Ready to Find or Host a Stoop Sale?</h3>
            <p className="mb-6 text-white/90">Browse hundreds of local stoop sales or list your own for free.</p>
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