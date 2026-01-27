import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calendar, MapPin, Shield, DollarSign, 
  Users, Search, ExternalLink, Mail, Book, FileText, ArrowRight
} from 'lucide-react';
import { useTranslation } from '../components/translations';
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const guides = [
  {
    id: 'advertise',
    title: 'How to Advertise a Yard Sale in NYC',
    description: 'Free and easy ways to reach local buyers and get more foot traffic',
    icon: FileText,
    color: 'bg-blue-100 text-blue-600',
    page: 'GuidesAdvertise'
  },
  {
    id: 'timing',
    title: 'Best Days & Times to Host a Yard Sale',
    description: 'When to host for maximum turnout and sales',
    icon: Calendar,
    color: 'bg-purple-100 text-purple-600',
    page: 'GuidesTimings'
  },
  {
    id: 'permit',
    title: 'Do You Need a Permit in New York?',
    description: 'Simple rules about yard sale permits in NYC',
    icon: Shield,
    color: 'bg-green-100 text-green-600',
    page: 'GuidesPermit'
  },
  {
    id: 'pricing',
    title: 'How to Price Items for a Yard Sale',
    description: 'Simple pricing rules to help your items sell',
    icon: DollarSign,
    color: 'bg-yellow-100 text-yellow-600',
    page: 'GuidesPricing'
  },
  {
    id: 'seniors',
    title: 'How Seniors Can Post a Yard Sale Online',
    description: 'Easy steps to list your sale without tech stress',
    icon: Users,
    color: 'bg-pink-100 text-pink-600',
    page: 'GuidesSeniors'
  },
  {
    id: 'find',
    title: 'Where to Find Yard Sales Near You',
    description: 'How to discover the best local sales this weekend',
    icon: MapPin,
    color: 'bg-orange-100 text-orange-600',
    page: 'GuidesFindSales'
  },
];

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

export default function Guides() {
  const [language, setLanguage] = useState('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState(faqData);

  useEffect(() => {
    const savedLang = localStorage.getItem('stooplify_lang') || 'en';
    setLanguage(savedLang);

    const handleLanguageChange = (e) => {
      setLanguage(e.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

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

  const t = useTranslation(language);

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF6F61]/10 rounded-2xl mb-4">
            <Book className="w-8 h-8 text-[#FF6F61]" />
          </div>
          <h1 
            className="text-3xl md:text-4xl font-bold text-[#2E3A59] dark:text-white mb-4"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {t('guides.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            {t('guides.subtitle')}
          </p>
        </motion.div>

        {/* Guide Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {guides.map((guide, index) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={createPageUrl(guide.page)}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 group h-full">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${guide.color} mb-4`}>
                    <guide.icon className="w-6 h-6" />
                  </div>
                  <h3 
                    className="text-xl font-bold text-[#2E3A59] dark:text-white mb-3 group-hover:text-[#FF6F61] transition-colors"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {t(`guides.cards.${guide.id}.title`)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {t(`guides.cards.${guide.id}.description`)}
                  </p>
                  <div className="flex items-center text-[#FF6F61] font-medium group-hover:gap-2 transition-all">
                    {t('guides.readMore')}
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 
            className="text-3xl font-bold text-[#2E3A59] dark:text-white mb-3 text-center"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-8 max-w-2xl mx-auto">
            Everything you need to know about using Stooplify
          </p>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-6 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
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
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-[#14B8FF] to-[#2E3A59] rounded-2xl p-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Still have questions?
          </h3>
          <p className="mb-4 opacity-90">
            Can't find what you're looking for? Reach out directly.
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