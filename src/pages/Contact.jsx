import React, { useState } from 'react';
import { Mail, Instagram, MessageCircle, Clock, MapPin, HelpCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailto = `mailto:daniel@stooplify.com?subject=${encodeURIComponent(form.subject || 'Stooplify Contact Form')}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
    window.location.href = mailto;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO
        title="Contact Stooplify | Get Help, Report Issues & Share Feedback"
        description="Get in touch with the Stooplify team. Ask questions about listings, report a problem, suggest a feature, or inquire about partnerships. We typically respond within 24 hours."
        canonical="https://stooplify.com/contact"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2E3A59] to-[#14B8FF] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-4xl mb-4 block">💬</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Contact Us
          </h1>
          <p className="text-white/85 text-lg max-w-xl mx-auto">
            Have a question, idea, or issue? We'd love to hear from you. Our team typically responds within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">

          {/* Contact form */}
          <div>
            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Send Us a Message
            </h2>
            {submitted ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-2xl p-6 text-center">
                <span className="text-4xl mb-3 block">✅</span>
                <h3 className="font-bold text-green-800 dark:text-green-300 text-lg mb-2">Message sent!</h3>
                <p className="text-green-700 dark:text-green-400 text-sm">Your email client should have opened. We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Jane Smith"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#14B8FF]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="jane@example.com"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#14B8FF]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                  <select
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#14B8FF]"
                  >
                    <option value="">Select a topic…</option>
                    <option value="Listing Help">Help with my listing</option>
                    <option value="Account Issue">Account issue</option>
                    <option value="Report a Listing">Report a suspicious listing</option>
                    <option value="Billing Question">Billing question</option>
                    <option value="Partnership Inquiry">Partnership / press inquiry</option>
                    <option value="Feature Request">Feature suggestion</option>
                    <option value="General Question">General question</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us how we can help…"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#14B8FF] resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#14B8FF] hover:bg-[#0da3e6] text-white font-semibold rounded-xl transition-colors"
                >
                  Send Message →
                </button>
              </form>
            )}
          </div>

          {/* Info panel */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Other Ways to Reach Us
              </h2>
              <div className="space-y-4">
                <a
                  href="mailto:daniel@stooplify.com"
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-[#FF6F61] transition-colors"
                >
                  <div className="w-11 h-11 bg-[#FF6F61]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#FF6F61]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#2E3A59] dark:text-white text-sm">Email</p>
                    <p className="text-[#FF6F61] text-sm">daniel@stooplify.com</p>
                  </div>
                </a>

                <a
                  href="https://www.instagram.com/stooplify/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-[#14B8FF] transition-colors"
                >
                  <div className="w-11 h-11 bg-[#14B8FF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-5 h-5 text-[#14B8FF]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#2E3A59] dark:text-white text-sm">Instagram</p>
                    <p className="text-[#14B8FF] text-sm">@stooplify</p>
                  </div>
                </a>

                <a
                  href="https://www.facebook.com/profile.php?id=61586102653727"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-blue-300 transition-colors"
                >
                  <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[#2E3A59] dark:text-white text-sm">Facebook</p>
                    <p className="text-blue-600 text-sm">Stooplify on Facebook</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Response time */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 border border-blue-100 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-[#14B8FF]" />
                <h3 className="font-bold text-[#2E3A59] dark:text-white">Response Times</h3>
              </div>
              <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
                <li>📧 <strong>Email:</strong> Within 24 hours (Mon–Fri)</li>
                <li>📸 <strong>Instagram DM:</strong> 1–2 business days</li>
                <li>⚠️ <strong>Urgent issues:</strong> Flag as "urgent" in subject line</li>
              </ul>
            </div>

            {/* Common topics */}
            <div>
              <h3 className="font-bold text-[#2E3A59] dark:text-white mb-3 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#FF6F61]" /> Common Questions
              </h3>
              <div className="space-y-2">
                {[
                  { q: 'How do I list my stoop sale?', url: '/add-yard-sale' },
                  { q: 'View pricing plans', url: '/pricing' },
                  { q: 'Read our seller guides', url: '/guides' },
                  { q: 'Safety tips for buyers & sellers', url: '/Legal#safety' },
                ].map(item => (
                  <Link
                    key={item.url}
                    to={item.url}
                    className="flex items-center gap-2 text-sm text-[#14B8FF] hover:underline"
                  >
                    → {item.q}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About / context section for AdSense content requirements */}
      <section className="bg-gray-50 dark:bg-gray-800/50 py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mb-6 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
            About Stooplify
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[
              { icon: '🗺️', title: 'Find Sales Near You', desc: 'Browse an interactive live map of stoop sales, yard sales, and garage sales across NYC and New Jersey.' },
              { icon: '📋', title: 'List Your Sale Free', desc: 'Post your stoop sale or yard sale in minutes. Your first listing is 100% free with no credit card required.' },
              { icon: '🏘️', title: 'NYC & NJ Community', desc: 'Connecting neighbors across Brooklyn, Queens, Manhattan, the Bronx, Staten Island, and New Jersey every weekend.' },
            ].map(item => (
              <div key={item.title} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-[#2E3A59] dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}