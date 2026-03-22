import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { Gift, MapPin, Shield, Package, ArrowRight } from 'lucide-react';

const SECTIONS = [
  {
    id: 'what-is',
    icon: '🎁',
    title: 'What Is a Freebie Listing on Stooplify?',
    body: `A Freebie listing is a free item giveaway posted locally on Stooplify. Instead of selling items, you're offering them to neighbors at no cost — no price tags, no cash, no hassle. Think of it like a digital curb alert: you post what you have, someone nearby picks it up, and the item finds a new home instead of a landfill.

Freebies on Stooplify are used for things like free furniture pickup, free baby items, moving giveaways, curb alerts, and more. Anyone searching for "free stuff near me" or "free items locally" in Brooklyn, Queens, Hoboken, or anywhere you're listed can find and claim your items.`
  },
  {
    id: 'when-to-use',
    icon: '🤔',
    title: 'When to Post a Free Listing Instead of a Sale',
    bullets: [
      'You\'re moving and need items gone fast',
      'Items are in good condition but not worth pricing individually',
      'You want to help neighbors rather than haggle',
      'Leftover items from a yard sale that didn\'t sell',
      'You\'re decluttering and don\'t need the money',
      'You have bulky items like furniture you can\'t easily donate',
    ],
    footer: 'If time matters more than money, a Free listing is the fastest, lowest-friction way to clear your space. If you\'re unsure whether to sell or give away, check out our guide on Selling vs. Giving Away Items.'
  },
  {
    id: 'how-to-create',
    icon: '📋',
    title: 'How to Create a Free Item Listing on Stooplify',
    steps: [
      { num: '01', title: 'Tap "List Your Sale"', body: 'Open Stooplify and go to the listing form.' },
      { num: '02', title: 'Select "Free Giveaway"', body: 'Toggle the listing type to "Free Giveaway" — this removes pricing fields and marks your listing with a green FREE badge.' },
      { num: '03', title: 'Describe Your Items', body: 'Write a short description. Be specific: "IKEA KALLAX shelving unit, white, good condition" gets picked up faster than "old shelf."' },
      { num: '04', title: 'Add Tags', body: 'Tag your listing as Curbside, Moving, First Come First Served (FCFS), or Bundle so neighbors know what to expect.' },
      { num: '05', title: 'Upload Photos', body: 'A quick photo dramatically increases pickup speed. Show the actual condition clearly.' },
      { num: '06', title: 'Set a Pickup Window', body: 'Include available hours in your description. "Available Saturday 10am–4pm, gone by Sunday" sets clear expectations.' },
    ]
  },
  {
    id: 'tips',
    icon: '⚡',
    title: 'Tips for Fast Pickup',
    bullets: [
      'Mark as "Curbside" if you want no-contact pickup — just leave it out front',
      'Set a specific time window and stick to it',
      'Bundle related items together (e.g., "Full nursery set: crib + dresser + changing table")',
      'State the exact cross streets or nearest landmark',
      'Note if items need to be carried by two people',
      'Say if items are first come, first served (FCFS)',
      'If going fast, post to local Facebook or WhatsApp groups with a link to your Stooplify listing',
    ]
  },
  {
    id: 'safety',
    icon: '🛡️',
    title: 'Safety Tips for Meeting Neighbors',
    bullets: [
      'For curbside items, you don\'t need to meet anyone — just leave items outside',
      'If coordinating pickup, meet in a public or well-lit spot',
      'Use Stooplify\'s in-app messaging to communicate — no need to share your phone number',
      'Let a friend or family member know about the pickup if meeting someone',
      'Trust your gut — it\'s OK to cancel a pickup if something feels off',
    ]
  },
  {
    id: 'yard-sale-leftovers',
    icon: '♻️',
    title: 'Turning Leftover Yard Sale Items Into Freebies',
    body: `One of the best moves at the end of a yard or stoop sale: convert whatever\'s left into a Freebie listing on Stooplify.

Instead of dragging unsold items back inside or hauling them to a donation center, post a quick "Free — leftover from today\'s sale, grab what you want before 5pm" listing. Neighbors often come running.

This works especially well for:`,
    bullets: [
      'Clothing bundles that didn\'t sell individually',
      'Books, DVDs, and media',
      'Small kitchen items and housewares',
      'Kids\' toys and baby gear',
      'Décor and picture frames',
    ],
    footer: 'Convert leftover yard sale items to Free after your sale ends — it\'s one tap from your listing page.'
  }
];

const EXAMPLES = [
  { emoji: '🛋️', title: 'Free Furniture', desc: 'Couches, bookshelves, bed frames — large items people will drive for' },
  { emoji: '📚', title: 'Free Books', desc: 'Boxes of paperbacks, textbooks, kids\' books, DVDs' },
  { emoji: '👶', title: 'Free Baby Items', desc: 'Cribs, strollers, baby clothes, toys your kids outgrew' },
  { emoji: '📦', title: 'Moving Giveaways', desc: 'Everything that doesn\'t fit in the moving truck' },
  { emoji: '🚨', title: 'Curb Alert', desc: 'Items left curbside, first come first served — no coordination needed' },
  { emoji: '🏠', title: 'Full Room Clearouts', desc: 'Nursery sets, office furniture, kitchen gear all at once' },
];

const FAQ_ITEMS = [
  { q: 'Is it really free to post a Freebie listing on Stooplify?', a: 'Yes. Freebie listings are completely free to post on Stooplify. There\'s no charge for giving items away locally.' },
  { q: 'How do I find free stuff near me?', a: 'Open Stooplify and tap the FREE tab to browse all active freebie listings near you. You can filter by category or sort by distance.' },
  { q: 'What\'s a curb alert?', a: 'A curb alert means items are left outside on the sidewalk for anyone to take — no scheduling, no coordination. You post on Stooplify and whoever shows up first gets it.' },
  { q: 'Can I post free furniture pickup on Stooplify?', a: 'Absolutely. Free furniture is one of the most popular types of Freebie listings. Post a photo, note the pickup window, and tag it as "Curbside" if you want no-contact pickup.' },
  { q: 'What do I do with leftover yard sale items?', a: 'Convert them to a Freebie listing on Stooplify. It\'s fast, helps neighbors, and keeps things out of landfills. See our guide: How to Host a Stoop Sale for more tips.' },
];

export default function GuidesPostFreeStuff() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Post Free Stuff on Stooplify",
      "step": SECTIONS[2].steps.map((s, i) => ({
        "@type": "HowToStep",
        "position": i + 1,
        "name": s.title,
        "text": s.body
      }))
    },
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
        { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://stooplify.com/guides" },
        { "@type": "ListItem", "position": 3, "name": "How to Post Free Stuff", "item": "https://stooplify.com/guides-post-free-stuff" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title="How to Post Free Stuff on Stooplify — Give Away Items Locally | Stooplify"
        description="Learn how to post free items locally on Stooplify. Give away free furniture, baby items, books & more. Post a curb alert, set a pickup window, and help neighbors find free stuff near them in NYC, Brooklyn, Queens & Hoboken."
        keywords="free stuff near me, free furniture pickup, curb alert, free items locally, give away items locally, free stuff NYC, free stuff Brooklyn, free stuff Hoboken, post free items online, freebie listing"
        url="https://stooplify.com/guides-post-free-stuff"
        structuredData={structuredData}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-[#14B8FF] transition-colors">Home</Link>
          <span>›</span>
          <Link to="/guides" className="hover:text-[#14B8FF] transition-colors">Guides</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-medium">Post Free Stuff</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="mb-10">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
              <Gift className="w-4 h-4" /> Freebie Guide
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#2E3A59] dark:text-white mb-5 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              How to Post Free Stuff on Stooplify
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Stooplify isn't just for yard sales. You can give away free items locally — free furniture, books, baby gear, moving giveaways, curb alerts — and connect with neighbors who need them.
            </p>
          </div>

          {/* Example types */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
            {EXAMPLES.map((ex, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-2xl"
              >
                <div className="text-2xl mb-1">{ex.emoji}</div>
                <div className="font-semibold text-[#2E3A59] dark:text-white text-sm">{ex.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{ex.desc}</div>
              </motion.div>
            ))}
          </div>

          {/* Main sections */}
          <div className="space-y-12">
            {SECTIONS.map((section, i) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <span>{section.icon}</span> {section.title}
                </h2>

                {section.body && (
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 whitespace-pre-line">{section.body}</p>
                )}

                {section.steps && (
                  <div className="space-y-4">
                    {section.steps.map((step) => (
                      <div key={step.num} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <div className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {step.num}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#2E3A59] dark:text-white mb-1">{step.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{step.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {section.bullets && (
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    {section.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.footer && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-800 dark:text-green-300">
                    {section.id === 'yard-sale-leftovers' ? (
                      <>♻️ <Link to="/how-to-host-a-stoop-sale" className="underline hover:text-green-900">Convert leftover yard sale items to Free</Link> after your sale ends — it's one tap from your listing page.</>
                    ) : (
                      <>💡 {section.footer} <Link to="/guides-selling-vs-giving" className="underline hover:text-green-900">Selling vs. Giving Away guide →</Link></>
                    )}
                  </div>
                )}
              </motion.section>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white text-center">
            <Gift className="w-10 h-10 mx-auto mb-3 opacity-90" />
            <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Ready to Give Items Away?</h3>
            <p className="mb-6 text-white/90">Post a free Freebie listing in under 2 minutes. No cost, no hassle.</p>
            <Link to="/add-yard-sale?type=free" className="inline-block px-8 py-4 bg-white text-green-600 rounded-xl font-bold hover:bg-gray-100 transition-colors text-lg">
              Post a Freebie →
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

          {/* Related guides */}
          <div className="mt-10 p-6 bg-blue-50 dark:bg-gray-800 rounded-2xl border border-blue-100 dark:border-gray-700">
            <h3 className="font-bold text-[#2E3A59] dark:text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>📚 Related Guides</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: 'How to Host a Stoop Sale', url: '/how-to-host-a-stoop-sale' },
                { label: 'How to Price Yard Sale Items', url: '/guides-pricing-yard-sale-items' },
                { label: 'Selling vs. Giving Away Items', url: '/guides-selling-vs-giving' },
                { label: 'Browse Free Items Near You', url: '/free-items' },
              ].map(link => (
                <Link key={link.url} to={link.url} className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-[#14B8FF] hover:text-[#14B8FF] transition-all text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="text-[#14B8FF]">→</span>{link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Free items city links */}
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-[#2E3A59] dark:text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>📍 Free Stuff Near You</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Free Stuff NYC', url: '/free-stuff-nyc' },
                { label: 'Free Stuff Brooklyn', url: '/free-stuff-brooklyn' },
                { label: 'Free Stuff Queens', url: '/free-stuff-queens' },
                { label: 'Free Stuff Hoboken', url: '/free-stuff-hoboken' },
              ].map(city => (
                <Link key={city.url} to={city.url} className="px-3 py-2 bg-white dark:bg-gray-700 rounded-lg text-sm text-center font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 border border-gray-200 dark:border-gray-600 transition-colors">
                  {city.label}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </article>
    </div>
  );
}