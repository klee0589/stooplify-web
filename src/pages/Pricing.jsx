import React, { useState, useEffect } from 'react';
import { useTranslation } from '../components/translations';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Check, Store, Zap, TrendingUp, MapPin, Star, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Pricing() {
  const [language, setLanguage] = useState('en');
  
  useEffect(() => {
    const savedLang = localStorage.getItem('stooplify_lang') || 'en';
    setLanguage(savedLang);
    
    const handleLanguageChange = (e) => {
      setLanguage(e.detail);
    };
    
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);
  
  const t = useTranslation(language);
  
  const individualPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for your first yard sale',
      features: [
        '1 free listing',
        'Basic listing features',
        'Map visibility',
        'Photo uploads (up to 5)',
        'Community access'
      ],
      cta: 'Get Started',
      ctaLink: 'AddYardSale',
      popular: false,
      icon: MapPin,
      color: 'gray'
    },
    {
      name: 'Pay Per Listing',
      price: '$4',
      period: 'per listing',
      description: 'For occasional sellers',
      features: [
        'Unlimited photos',
        'Featured in search',
        'Priority visibility',
        'Email notifications',
        'Edit anytime'
      ],
      cta: 'List Your Sale',
      ctaLink: 'AddYardSale',
      popular: false,
      icon: Zap,
      color: 'orange'
    },
    {
      name: 'Unlimited',
      price: '$9',
      period: 'per month',
      description: 'Best for frequent sellers',
      features: [
        'Unlimited listings',
        'Premium placement',
        'Analytics dashboard',
        'Featured badge',
        'Early access to features',
        'Cancel anytime'
      ],
      cta: 'Go Unlimited',
      ctaLink: 'AddYardSale',
      popular: true,
      icon: TrendingUp,
      color: 'coral'
    }
  ];

  const businessPlan = {
    name: 'Featured Shop',
    price: '$49',
    period: 'per month',
    description: 'For thrift stores, consignment shops & permanent locations',
    features: [
      'Homepage featured placement',
      'Unlimited weekly postings',
      'Shop profile page',
      'Custom branding',
      'Priority customer support',
      'Analytics & insights',
      'Social media promotion',
      'Link to your website'
    ],
    cta: 'Apply Now',
    ctaLink: 'ApplyAsShop',
    icon: Store,
    badge: 'Most Visible'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F9F9] to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 
            className="text-4xl md:text-5xl font-bold text-[#2E3A59] mb-4"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {t('simplePricing')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('pricingDesc')}
          </p>
        </motion.div>

        {/* Individual Plans */}
        <div className="mb-16">
          <h2 
            className="text-2xl font-bold text-[#2E3A59] mb-8 text-center"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {t('forIndividualSellers')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {individualPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-3xl p-8 shadow-lg relative ${
                  plan.popular ? 'ring-2 ring-[#FF6F61] scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#FF6F61] text-white px-6 py-1 rounded-full text-sm font-semibold">
                      {t('mostPopular')}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="w-12 h-12 bg-[#FF6F61]/10 rounded-xl flex items-center justify-center mb-4">
                    <plan.icon className="w-6 h-6 text-[#FF6F61]" />
                  </div>
                  <h3 
                    className="text-2xl font-bold text-[#2E3A59] mb-2"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-[#2E3A59]">{plan.price}</span>
                    <span className="text-gray-500">/ {plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to={createPageUrl(plan.ctaLink)}>
                  <Button 
                    className={`w-full py-6 rounded-xl font-semibold ${
                      plan.popular 
                        ? 'bg-[#FF6F61] hover:bg-[#e55a4d]' 
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Business Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 
            className="text-2xl font-bold text-[#2E3A59] mb-8 text-center"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {t('forBusinesses')}
          </h2>
          
          <div className="bg-gradient-to-r from-[#FF6F61] to-[#F5A623] rounded-3xl p-8 md:p-12 shadow-2xl text-white relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                <Star className="w-4 h-4" />
                {t('mostVisible')}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                  <businessPlan.icon className="w-8 h-8" />
                </div>
                <h3 
                  className="text-3xl font-bold mb-3"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {businessPlan.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold">{businessPlan.price}</span>
                  <span className="text-white/80 text-lg">/ {businessPlan.period}</span>
                </div>
                <p className="text-white/90 text-lg mb-6">{businessPlan.description}</p>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
                  <p className="text-sm text-white/90 leading-relaxed">
                    <strong>{t('perfectFor')}:</strong> {t('perfectForDesc')}
                  </p>
                </div>

                <Link to={createPageUrl(businessPlan.ctaLink)}>
                  <Button 
                    className="bg-white text-[#FF6F61] hover:bg-gray-100 py-6 px-8 rounded-xl font-semibold text-lg"
                  >
                    {businessPlan.cta}
                  </Button>
                </Link>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-4">{t('everythingYouNeed')}:</h4>
                <ul className="space-y-3">
                  {businessPlan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="text-white/95">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <h3 className="text-xl font-semibold text-[#2E3A59] mb-4">{t('haveQuestions')}</h3>
          <p className="text-gray-600">
            {t('contactUs')}{' '}
            <a href="mailto:daniel@stooplify.com" className="text-[#FF6F61] hover:underline">
              daniel@stooplify.com
            </a>
          </p>
        </motion.div>


      </div>
    </div>
  );
}