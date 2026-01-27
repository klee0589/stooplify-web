import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    question: "What is Stooplify?",
    answer: "Stooplify is an app that helps you list, find, and buy items from garage sales, estate sales, and local sellers—all in one place. Think of it as a digital garage sale with built-in foot traffic."
  },
  {
    question: "How do I list an item?",
    answer: "Simply open the app, click 'List a Sale,' upload photos, add a description, select date/time, and specify your location. You can also choose which payment methods you accept."
  },
  {
    question: "Can I sell furniture and large items?",
    answer: "Yes! Stooplify supports furniture, plants, electronics, collectibles, and basically anything you'd normally see at a garage or estate sale."
  },
  {
    question: "Can I specify payment types?",
    answer: "Absolutely. Sellers can mark which payment methods they accept: cash, credit/debit cards, or digital payments (Venmo, PayPal, etc.). You can even mark cash as preferred if you accept multiple methods."
  },
  {
    question: "How do buyers find my listings?",
    answer: "Buyers can search by category, location, date, and even filter by payment methods. Stooplify also has a Smart Alerts feature that notifies users of new sales in their followed neighborhoods and categories."
  },
  {
    question: "How do I handle pickup or delivery?",
    answer: "You set the exact address and date/time for your sale. Buyers can message you through the app to coordinate details. The exact address is revealed 24 hours before the sale or when someone marks they're attending."
  },
  {
    question: "Is Stooplify free to use?",
    answer: "Your first listing is completely free! After that, you can either pay $4 per listing or upgrade to our Unlimited plan for $9/month to post as many sales as you want with no per-listing fees."
  },
  {
    question: "Can I schedule a garage sale in the app?",
    answer: "Yes! You can list an upcoming garage sale with date, time, and location. Buyers can favorite your sale and get reminders. You can also generate a printable flyer with a QR code to promote it locally."
  },
  {
    question: "What makes Stooplify different from Facebook Marketplace or Craigslist?",
    answer: "Stooplify is centralized, local, and focused on yard sales specifically. Unlike general marketplaces, we offer features like printable flyers with QR codes, smart neighborhood alerts, payment method filtering, and a trust system with seller ratings. Plus, you don't need to spam social groups or rely on chance."
  },
  {
    question: "I don't have a garage. Can I still sell?",
    answer: "Totally. Stooplify lets you list yard sales, stoop sales, sidewalk sales, or any type of local sale. You don't need your own yard - as long as you have a location and items to sell, you're good to go!"
  }
];

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState(faqData);

  useEffect(() => {
    if (searchTerm) {
      const filtered = faqData.filter(
        faq =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFaqs(filtered);
    } else {
      setFilteredFaqs(faqData);
    }
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to={createPageUrl('Home')}>
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#FF6F61] transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </motion.button>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 
            className="text-4xl font-bold text-[#2E3A59] dark:text-white mb-3"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about using Stooplify to buy and sell locally
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-6 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
          </div>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No FAQs match your search.</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-2">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 data-[state=open]:bg-[#14B8FF]/5"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <span className="text-left font-semibold text-[#2E3A59] dark:text-white">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-gradient-to-br from-[#14B8FF] to-[#2E3A59] rounded-2xl p-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Still have questions?
          </h3>
          <p className="mb-4 opacity-90">
            Can't find what you're looking for? Reach out to us directly.
          </p>
          <a 
            href="mailto:daniel@stooplify.com"
            className="inline-block px-6 py-3 bg-white text-[#14B8FF] rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Support
          </a>
        </motion.div>
      </div>
    </div>
  );
}