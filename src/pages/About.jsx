import React from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title="About Stooplify | Local Yard Sale & Stoop Sale Finder NYC & NJ"
        description="Learn about Stooplify — the NYC-based platform that helps you find and list yard sales, stoop sales, garage sales and estate sales across Brooklyn, Queens, Manhattan, the Bronx, and New Jersey."
        canonical="https://stooplify.com/about"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2E3A59] to-[#14B8FF] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-5xl mb-4 block">🗽</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            About Stooplify
          </h1>
          <p className="text-white/85 text-xl max-w-2xl mx-auto">
            NYC's free community platform for stoop sales, yard sales, and garage sales — connecting neighbors one sale at a time.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">

          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6 leading-relaxed">
            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>What Is Stooplify?</h2>
            <p>
              Stooplify is a community-driven marketplace and discovery platform built specifically for stoop sales, yard sales, garage sales, and estate sales across New York City and the greater tri-state area including New Jersey and Connecticut. We make it easy for buyers to find local sales on an interactive map and for sellers to list their events in minutes — completely free.
            </p>
            <p>
              Unlike generic classifieds sites, Stooplify is built around the unique culture of NYC sidewalk sales. In Brooklyn, Queens, Manhattan, the Bronx, and Staten Island, stoop sales are a beloved weekend tradition — a way for neighbors to declutter, make extra money, and connect with their community. Stooplify puts all of that on a single live map, updated in real time.
            </p>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Our Story</h2>
            <p>
              Stooplify was founded by Daniel, a lifelong New Yorker who grew up in Queens and Brooklyn and has always loved the thrill of finding a great deal at a local stoop sale. The idea came from a simple frustration: amazing neighborhood sales were invisible unless you happened to walk past at exactly the right moment. Great items were being missed. Buyers couldn't plan their routes. Sellers couldn't reach the buyers actively looking for what they were selling.
            </p>
            <p>
              Daniel built Stooplify to solve that problem — to make local sales visible, searchable, and accessible to everyone. Since launching, Stooplify has helped thousands of NYC and NJ residents host their own sales, find incredible deals, and connect with their neighbors in a meaningful way.
            </p>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>For Buyers: Find Sales Near You</h2>
            <p>
              Stooplify gives buyers a powerful set of tools to discover local sales:
            </p>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong>Live Map View</strong> — See all upcoming sales plotted on an interactive map. Browse by neighborhood, borough, or city and plan your Saturday shopping route before you leave home.</li>
              <li><strong>Category Filters</strong> — Filter sales by what you're looking for: furniture, clothing, electronics, antiques, books, sports gear, children's items, and more.</li>
              <li><strong>Weekend Alerts</strong> — Sign up for our weekly email digest and get a list of upcoming sales in your neighborhood delivered to your inbox every Thursday.</li>
              <li><strong>Favorites & Attendance</strong> — Save sales you're interested in, mark yourself as attending to unlock the exact address, and get reminded the morning of the sale.</li>
              <li><strong>Seller Messaging</strong> — Message sellers directly through Stooplify to ask about specific items, get directions, or negotiate before you arrive.</li>
              <li><strong>Verified Reviews</strong> — Read and leave verified reviews from people who actually attended each sale. Know what to expect before you go.</li>
              <li><strong>Free Items Near You</strong> — A dedicated section for free giveaway listings — curbside items, moving sales, and "first come, first served" freebies across NYC and NJ.</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>For Sellers: List Your Sale for Free</h2>
            <p>
              Listing your stoop sale or yard sale on Stooplify takes less than five minutes. Here's what you get:
            </p>
            <ul className="space-y-2 list-disc pl-5">
              <li><strong>Free Listings</strong> — Your first listing is 100% free. No credit card required. List your date, location, categories, and a description and go live immediately.</li>
              <li><strong>Photo Upload</strong> — Upload photos of your items to attract more buyers. Listings with photos get significantly more views than text-only listings.</li>
              <li><strong>AI Description Generator</strong> — Our built-in AI can write a compelling sale description for you based on photos of your items — saving you time and attracting better buyers.</li>
              <li><strong>Printable Flyer</strong> — Generate a printable flyer with a QR code that you can post around your neighborhood to drive foot traffic.</li>
              <li><strong>Seller Analytics</strong> — Track how many people viewed your listing, favorited it, and marked themselves as attending — so you know what kind of turnout to expect.</li>
              <li><strong>QR Code Check-Ins</strong> — Buyers can scan a QR code at your sale to verify they attended, building your seller reputation over time.</li>
              <li><strong>Featured Listings</strong> — Upgrade to a paid listing for extra visibility on the homepage and at the top of search results.</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Where We Operate</h2>
            <p>
              Stooplify currently serves the following areas, with more being added regularly:
            </p>
            <ul className="space-y-1 list-disc pl-5 columns-2">
              <li>Brooklyn, NY</li>
              <li>Queens, NY</li>
              <li>Manhattan, NY</li>
              <li>The Bronx, NY</li>
              <li>Staten Island, NY</li>
              <li>Jersey City, NJ</li>
              <li>Hoboken, NJ</li>
              <li>Newark, NJ</li>
              <li>Elizabeth, NJ</li>
              <li>Linden, NJ</li>
              <li>Seaside Heights, NJ</li>
              <li>Phillipsburg, NJ</li>
            </ul>
            <p>
              We're expanding! If you'd like to see Stooplify in your city, <a href="/contact" className="text-[#14B8FF] hover:underline">reach out and let us know</a>.
            </p>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Trust & Safety</h2>
            <p>
              We care deeply about making Stooplify a safe and trustworthy community. All listings are reviewed before they go live. We have a robust reporting system so the community can flag suspicious or inaccurate listings. Our <strong>Verified Seller</strong> badges are earned through real check-ins at actual sales, not just profile creation.
            </p>
            <p>
              We strongly encourage buyers to meet sellers in public, visible locations and to bring a friend when visiting a new address. Read our full <Link to="/Legal#safety" className="text-[#14B8FF] hover:underline">Safety Guidelines</Link> for tips on staying safe at sales.
            </p>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Contact Us</h2>
            <p>
              We'd love to hear from you — whether you have feedback, a partnership idea, or just want to say hello. Reach us at <a href="mailto:daniel@stooplify.com" className="text-[#14B8FF] hover:underline">daniel@stooplify.com</a> or visit our <Link to="/contact" className="text-[#14B8FF] hover:underline">Contact page</Link>.
            </p>
            <p>
              Follow us on <a href="https://www.instagram.com/stooplify/" target="_blank" rel="noopener noreferrer" className="text-[#14B8FF] hover:underline">Instagram @stooplify</a> and <a href="https://www.facebook.com/profile.php?id=61586102653727" target="_blank" rel="noopener noreferrer" className="text-[#14B8FF] hover:underline">Facebook</a> for sale highlights, tips, and community updates.
            </p>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="bg-gray-50 dark:bg-gray-800 py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mb-8 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>Explore Stooplify</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: '🗺️ Find Sales Near Me', url: '/yard-sales', desc: 'Browse the live map of upcoming sales' },
              { label: '🆓 Free Items Near Me', url: '/free-items', desc: 'Curbside giveaways and free stuff' },
              { label: '📋 List Your Sale', url: '/add-yard-sale', desc: 'Post your stoop sale in minutes' },
              { label: '📖 Seller Guides', url: '/guides', desc: 'Tips for hosting a great sale' },
              { label: '📅 Sale Calendar', url: '/calendar', desc: 'Browse sales by date' },
              { label: '📝 Blog', url: '/blog', desc: 'News, tips and community stories' },
            ].map(item => (
              <Link key={item.url} to={item.url} className="bg-white dark:bg-gray-700 rounded-2xl p-5 border border-gray-200 dark:border-gray-600 hover:border-[#14B8FF] hover:shadow-md transition-all">
                <div className="font-bold text-[#2E3A59] dark:text-white mb-1">{item.label}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}