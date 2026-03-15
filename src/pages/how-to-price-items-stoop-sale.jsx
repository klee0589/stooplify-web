import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const FAQ_ITEMS = [
  { q: 'How do you price items for a stoop sale?', a: 'A good rule of thumb is to price items at 10–30% of their original retail price. Anything in great condition can go higher; items with wear or age should be priced to move. When in doubt, price low — you\'ll sell more and have less to carry back inside.' },
  { q: 'Should I put prices on everything at my stoop sale?', a: 'Yes, absolutely. Buyers are much more likely to pick up and buy an item if it has a visible price tag. Unlabeled items create awkward moments and often just get passed over.' },
  { q: 'What is the $1 table strategy?', a: 'The $1 table (or sometimes $0.25–$0.50 bin) is a psychological tool that draws people in and gets them browsing. Once someone is at your table picking up cheap items, they\'re much more likely to notice and buy higher-priced pieces too.' },
  { q: 'How should I price furniture at a stoop sale?', a: 'Furniture should be priced based on brand, condition, and current market value. Check Facebook Marketplace and eBay "sold" listings for comparable pieces. Be realistic — buyers are hauling it themselves, so factor in that convenience.' },
];

const PRICE_GUIDE = [
  { category: '👗 Clothing', range: '$1 – $15', notes: 'T-shirts $1–3, jeans $5–10, dresses $5–15, coats $10–25' },
  { category: '📚 Books', range: '$0.25 – $3', notes: 'Paperbacks $0.25–1, hardcovers $1–3, rare/specialty $5+' },
  { category: '🎮 Electronics', range: '$5 – $50+', notes: 'Cables $1–5, small gadgets $5–15, laptops/cameras $25–100+' },
  { category: '🪑 Furniture', range: '$10 – $200+', notes: 'Chairs $10–40, tables $25–100, sofas $50–200+' },
  { category: '🧸 Toys & Kids', range: '$0.50 – $20', notes: 'Small toys $0.50–2, board games $2–8, bikes $15–40' },
  { category: '🏺 Antiques/Vintage', range: 'Research first', notes: 'Check eBay sold prices before tagging vintage items' },
  { category: '🍳 Kitchen & Home', range: '$0.50 – $15', notes: 'Mugs $0.50–1, pots $3–10, small appliances $5–20' },
  { category: '📀 Media (DVDs/CDs)', range: '$0.25 – $2', notes: 'Bundle by genre for faster sales' },
];

export default function HowToPriceItemsStoopSale() {
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
      "headline": "How to Price Items for a Stoop Sale (NYC Seller Guide)",
      "description": "Learn exactly how to price items for a stoop sale or yard sale in NYC. Includes price ranges by category, the $1 table strategy, bundling tips, and furniture pricing advice.",
      "url": "https://stooplify.com/how-to-price-items-stoop-sale",
      "publisher": { "@type": "Organization", "name": "Stooplify" }
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title="How to Price Items for a Stoop Sale — NYC Seller Guide | Stooplify"
        description="Learn exactly how to price items for a stoop sale or yard sale in NYC. Includes price ranges by category, the $1 table strategy, bundling tips, and furniture pricing advice."
        keywords="how to price items for a stoop sale, yard sale pricing guide, stoop sale prices, how much to charge yard sale, pricing garage sale items NYC"
        url="https://stooplify.com/how-to-price-items-stoop-sale"
        structuredData={structuredData}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-16">
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-[#14B8FF] transition-colors">Home</Link>
          <span>›</span>
          <Link to="/guides" className="hover:text-[#14B8FF] transition-colors">Guides</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-medium">How to Price Items</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2E3A59] dark:text-white mb-6 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            How to Price Items for a Stoop Sale
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
            Price too high and nothing sells. Price too low and you leave money on the table. Here's how to get it right — with real NYC price ranges, category-by-category.
          </p>

          <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-8" style={{ fontFamily: 'Poppins, sans-serif' }}>The Golden Rule: Price to Sell</h2>
            <p>Before you tape a single price tag, remember this: <strong>you're not trying to recoup what you paid</strong>. Stoop sale buyers are looking for deals. Your goal is to convert clutter into cash and clear space.</p>
            <p>A general rule is to price items at <strong>10–30% of their original retail value</strong>. Items in excellent or brand-new condition can push toward 30%. Worn or dated items should be closer to 10% — or less.</p>
            <p>When in doubt, go lower. A faster sale is worth more than an extra dollar or two.</p>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>NYC Stoop Sale Price Guide by Category</h2>
            <p>Here's a realistic breakdown of what items typically sell for at NYC stoop sales:</p>
          </div>

          {/* Price Guide Table */}
          <div className="my-8 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="text-left px-4 py-3 font-bold text-[#2E3A59] dark:text-white">Category</th>
                  <th className="text-left px-4 py-3 font-bold text-[#2E3A59] dark:text-white">Price Range</th>
                  <th className="text-left px-4 py-3 font-bold text-[#2E3A59] dark:text-white hidden sm:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody>
                {PRICE_GUIDE.map((row, i) => (
                  <tr key={i} className={`border-t border-gray-200 dark:border-gray-700 ${i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{row.category}</td>
                    <td className="px-4 py-3 text-[#14B8FF] font-semibold">{row.range}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden sm:table-cell">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>The $1 Table Strategy</h2>
            <p>One of the most effective tricks at a NYC stoop sale is setting up a dedicated <strong>"$1 table"</strong> (or even a $0.25 bin). Fill it with small items — keychains, paperbacks, random knick-knacks, phone cases — and place it at the front.</p>
            <p>Here's why it works: once a buyer stops and starts picking through cheap items, they're engaged. They'll start browsing your more expensive pieces too. It's the same reason stores put sale bins near the entrance. The $1 table is the hook.</p>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Bundling to Sell Faster</h2>
            <p>Bundling works especially well for lower-value items. Instead of pricing 10 DVDs at $0.50 each, offer "5 for $2" or "fill a bag for $5." Buyers feel like they're getting a deal, and you move inventory faster.</p>
            <p>Great items to bundle: books, CDs/DVDs, children's clothes, kitchen utensils, cables, and accessories.</p>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Pricing Furniture at a Stoop Sale</h2>
            <p>Furniture is where most sellers either undersell (giving away great pieces) or overprice (carrying heavy things back upstairs). Before pricing, <strong>search eBay's "sold listings" and Facebook Marketplace</strong> for comparable items in your area.</p>
            <p>Key factors: brand name, condition, style (vintage and mid-century are hot in NYC), and practical weight/size. A buyer hauling a bookshelf on the subway deserves a discount — factor that in.</p>
            <p>Tip: post your bigger furniture items on Stooplify <em>before</em> the sale day with photos. Interested buyers will reach out and you can confirm the item is still available.</p>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>Label Everything</h2>
            <p>Unlabeled items don't sell. Buyers feel awkward asking the price for every single thing, so they just move on. <strong>Use masking tape and a marker</strong> — it's fast, cheap, and removes easily. Label everything, including the obvious.</p>
            <p>For collections of same-priced items, put up a handwritten sign: "All books $1" or "Everything on this rack $3."</p>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mt-10" style={{ fontFamily: 'Poppins, sans-serif' }}>How Much Can You Make at a Stoop Sale?</h2>
            <p>Most NYC stoop sellers walk away with <strong>$100–$500</strong> for a half-day of selling. Sellers who post listings in advance, have furniture or electronics, and price strategically often earn more. Read our guide on <Link to="/guides-pricing-yard-sale-items" className="text-[#14B8FF] hover:underline">pricing yard sale items</Link> for more detail.</p>

          </div>

          {/* CTA to list */}
          <div className="mt-10 p-6 bg-blue-50 dark:bg-gray-800 rounded-2xl border border-blue-100 dark:border-gray-700">
            <h3 className="font-bold text-[#2E3A59] dark:text-white mb-2 text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>📢 Ready to Host Your Stoop Sale?</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Post your stoop sale on Stooplify for free and reach thousands of local buyers in your neighborhood.</p>
            <Link to="/add-yard-sale" className="inline-block px-5 py-2.5 bg-[#14B8FF] text-white rounded-xl font-semibold text-sm hover:bg-[#0da3e6] transition-colors">
              List Your Sale Free →
            </Link>
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
            <h3 className="font-bold text-[#2E3A59] dark:text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>📖 More Stoop Sale Guides</h3>
            <div className="space-y-2">
              {[
                { label: 'How to Advertise a Stoop Sale in NYC', url: '/guides-advertise-yard-sale' },
                { label: 'Best Days & Times to Host a Stoop Sale', url: '/best-time-for-yard-sales' },
                { label: 'What Is a Stoop Sale? NYC Tradition Explained', url: '/what-is-a-stoop-sale' },
                { label: 'Find Stoop Sales Near You', url: '/find-stoop-sales-near-you' },
              ].map(link => (
                <Link key={link.url} to={link.url} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-[#14B8FF] transition-colors">
                  <span className="text-[#14B8FF]">→</span> {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 bg-gradient-to-r from-[#FF6F61] to-[#F5A623] rounded-2xl text-white text-center">
            <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Find Stoop Sales Near You</h3>
            <p className="mb-6 text-white/90">Browse NYC stoop sales on Stooplify's live map — updated every weekend.</p>
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