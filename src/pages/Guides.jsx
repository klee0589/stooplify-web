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
import SEO from '../components/SEO';
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

const getFaqData = (t) => [
  { question: t('faq.questions.whatIs.q'), answer: t('faq.questions.whatIs.a') },
  { question: t('faq.questions.howToList.q'), answer: t('faq.questions.howToList.a') },
  { question: t('faq.questions.furniture.q'), answer: t('faq.questions.furniture.a') },
  { question: t('faq.questions.payment.q'), answer: t('faq.questions.payment.a') },
  { question: t('faq.questions.howBuyersFind.q'), answer: t('faq.questions.howBuyersFind.a') },
  { question: t('faq.questions.pickup.q'), answer: t('faq.questions.pickup.a') },
  { question: t('faq.questions.free.q'), answer: t('faq.questions.free.a') },
  { question: t('faq.questions.schedule.q'), answer: t('faq.questions.schedule.a') },
  { question: t('faq.questions.difference.q'), answer: t('faq.questions.difference.a') },
  { question: t('faq.questions.noGarage.q'), answer: t('faq.questions.noGarage.a') }
];

export default function Guides() {
  const [language, setLanguage] = useState('en');
  const [searchTerm, setSearchTerm] = useState('');
  const t = useTranslation(language);
  const faqData = getFaqData(t);
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
  }, [searchTerm, faqData]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": filteredFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900">
      <SEO 
        title="Yard Sale Guides & FAQ | Stooplify"
        description="Complete guides on hosting yard sales, pricing items, advertising, and frequently asked questions about using Stooplify."
        keywords="yard sale guide, how to host yard sale, yard sale pricing, yard sale tips, garage sale FAQ"
        structuredData={structuredData}
      />
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
            {t('faq.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-8 max-w-2xl mx-auto">
            {t('faq.subtitle')}
          </p>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder={t('faq.searchPlaceholder')}
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
                <p className="text-gray-500 dark:text-gray-400">{t('faq.noResults')}</p>
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
            {t('faq.contactTitle')}
          </h3>
          <p className="mb-4 opacity-90">
            {t('faq.contactSubtitle')}
          </p>
          <a 
            href="mailto:daniel@stooplify.com"
            className="inline-block px-6 py-3 bg-white text-[#14B8FF] rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            {t('faq.contactButton')}
          </a>
        </motion.div>
      </div>
    </div>
  );
}