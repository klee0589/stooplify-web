import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { 
  Calendar, MapPin, Shield, DollarSign, 
  Users, Search, Book, FileText, ArrowRight,
  QrCode, Printer, Share2, Star, MessageCircle, Bell, Tag, Clock
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

const sellerGuides = [
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
];

const buyerGuides = [
  {
    id: 'find',
    title: 'Where to Find Yard Sales Near You',
    description: 'How to discover the best local sales this weekend',
    icon: MapPin,
    color: 'bg-orange-100 text-orange-600',
    page: 'GuidesFindSales'
  },
];

const getSellerFeatures = (language) => {
  const isEs = language === 'es';
  return [
    {
      icon: Share2,
      color: 'bg-blue-100 text-blue-600',
      title: isEs ? 'Comparte tu Venta' : 'Share Your Sale',
      description: isEs
        ? 'Cada anuncio tiene un botón de Compartir. Tócalo para compartir tu venta directamente en Facebook, WhatsApp, Instagram, X (Twitter) y más. ¡Cuanto más compartes, más tráfico obtienes!'
        : 'Every listing has a Share button. Tap it to share your sale directly to Facebook, WhatsApp, Instagram, X (Twitter), and more. The more you share, the more foot traffic you get!',
    },
    {
      icon: Printer,
      color: 'bg-green-100 text-green-600',
      title: isEs ? 'Imprime un Volante' : 'Print a Flyer',
      description: isEs
        ? 'En la página de detalles de tu venta, toca "Imprimir Volante" para generar un hermoso PDF con tu información, fotos y un código QR. Imprímelo y cuélgalo cerca de tu cuadra.'
        : 'On your sale\'s detail page, tap "Print Flyer" to generate a beautiful PDF flyer with your sale info, photos, and a QR code. Print it and hang it up near your block to drive local foot traffic.',
    },
    {
      icon: QrCode,
      color: 'bg-purple-100 text-purple-600',
      title: isEs ? 'Código QR de tu Venta' : 'Your Sale\'s QR Code',
      description: isEs
        ? 'Cada anuncio tiene un código QR único. Muéstralo en tu venta para que los compradores lo escaneen y verifiquen su asistencia. El código QR también se imprime automáticamente en tu volante.'
        : 'Each listing has a unique QR code. Display it at your sale so buyers can scan it to verify attendance. The QR code is also printed on your flyer automatically. You can download it separately from the sale page.',
    },
    {
      icon: Tag,
      color: 'bg-yellow-100 text-yellow-600',
      title: isEs ? 'Configura Métodos de Pago' : 'Set Payment Methods',
      description: isEs
        ? 'Informa a los compradores qué métodos de pago aceptas: efectivo, tarjetas de crédito/débito o pagos digitales como Venmo y PayPal. ¡Los compradores pueden filtrar ventas por método de pago!'
        : 'Let buyers know what payment you accept: Cash, Credit/Debit cards, or digital payments like Venmo and PayPal. You can also mark Cash as preferred. Buyers can filter sales by payment method!',
    },
    {
      icon: Star,
      color: 'bg-pink-100 text-pink-600',
      title: isEs ? 'Construye tu Reputación' : 'Build Your Seller Reputation',
      description: isEs
        ? 'Después de que los compradores asistan a tu venta, pueden dejar una calificación y reseña. Una buena reputación genera confianza y atrae más compradores a tus futuras ventas.'
        : 'After buyers attend your sale, they can leave a star rating and review. A strong reputation score builds trust and gets more buyers excited to show up to your future sales.',
    },
    {
      icon: Clock,
      color: 'bg-orange-100 text-orange-600',
      title: isEs ? 'Privacidad de Dirección' : 'Address Privacy',
      description: isEs
        ? 'Tu dirección exacta se mantiene privada hasta el día de la venta. Se desbloquea automáticamente en la fecha de la venta o cuando un comprador toca "Asistiré". Solo se muestra públicamente tu vecindario general.'
        : 'Your exact street address is kept private until the day of your sale. It unlocks automatically on the sale date, or when a buyer taps "I\'m Attending." Only your general neighborhood is shown publicly.',
    },
  ];
};

const getBuyerFeatures = (language) => {
  const isEs = language === 'es';
  return [
    {
      icon: QrCode,
      color: 'bg-purple-100 text-purple-600',
      title: isEs ? 'Escanea Códigos QR para Ganar Créditos' : 'Scan QR Codes to Earn Credits',
      description: isEs
        ? 'Cuando llegues a una venta, busca el código QR del vendedor (en su volante o teléfono). Escanéalo con Stooplify para verificar tu asistencia y ganar créditos. Debes estar físicamente cerca para que cuente.'
        : 'When you arrive at a sale, look for the seller\'s QR code (on their flyer or phone). Scan it with Stooplify to verify your attendance and earn credits. You must be physically nearby for the scan to count.',
    },
    {
      icon: Bell,
      color: 'bg-blue-100 text-blue-600',
      title: isEs ? 'Alertas Inteligentes de Ventas' : 'Smart Sale Alerts',
      description: isEs
        ? 'Configura alertas en tu perfil para recibir notificaciones cuando aparezcan nuevas ventas cerca de ti o en categorías que te gustan. ¡Nunca más te pierdas una gran venta en tu vecindario!'
        : 'Set up alerts in your profile to get notified when new sales pop up near you or in categories you love (furniture, clothing, antiques, etc.). Never miss a great sale in your neighborhood again.',
    },
    {
      icon: Calendar,
      color: 'bg-green-100 text-green-600',
      title: isEs ? 'Usa la Vista de Calendario' : 'Use the Calendar View',
      description: isEs
        ? 'La página de Calendario muestra todas las ventas próximas en una vista mensual. Ve qué días hay ventas cerca, filtra por categoría o distancia y planifica tu ruta de caza de tesoros.'
        : 'The Calendar page shows all upcoming sales in a monthly view. See which days have sales near you, filter by category or distance, and plan your treasure-hunting route in advance.',
    },
    {
      icon: MapPin,
      color: 'bg-orange-100 text-orange-600',
      title: isEs ? 'Explora el Mapa' : 'Browse the Map',
      description: isEs
        ? 'Cambia a la vista de Mapa en la página de Explorar para ver ventas cerca de ti. Toca cualquier marcador para previsualizar la venta. Usa filtros para ver solo lo que es relevante.'
        : 'Switch to Map view on the Browse page to see sales plotted near you. Tap any pin to preview the sale. Use filters to narrow by category, date, or distance so you only see what\'s relevant.',
    },
    {
      icon: MessageCircle,
      color: 'bg-yellow-100 text-yellow-600',
      title: isEs ? 'Envía Mensajes al Vendedor' : 'Message the Seller',
      description: isEs
        ? '¿Tienes una pregunta sobre un artículo específico? Toca el botón de mensaje en cualquier página de venta para enviar un mensaje directo al vendedor. Recibirás una notificación cuando responda.'
        : 'Have a question about a specific item? Tap the message button on any sale page to send the seller a direct message. You\'ll get notified when they reply.',
    },
    {
      icon: Star,
      color: 'bg-pink-100 text-pink-600',
      title: isEs ? 'Deja Reseñas' : 'Leave Reviews',
      description: isEs
        ? 'Después de asistir a una venta, ayuda a la comunidad dejando una calificación y reseña. Márcate primero como "Asistiré" y después comparte tu experiencia para ayudar a futuros compradores.'
        : 'After attending a sale, help the community by leaving a star rating and review. Mark yourself as "Attending" first, then after the sale you can share your experience to help future buyers.',
    },
  ];
};

const getFaqData = (t) => [
  { question: t('faq.questions.whatIs.q'), answer: t('faq.questions.whatIs.a'), tab: 'all' },
  { question: t('faq.questions.howToList.q'), answer: t('faq.questions.howToList.a'), tab: 'sellers' },
  { question: t('faq.questions.aiDescription.q'), answer: t('faq.questions.aiDescription.a'), tab: 'sellers' },
  { question: t('faq.questions.furniture.q'), answer: t('faq.questions.furniture.a'), tab: 'sellers' },
  { question: t('faq.questions.payment.q'), answer: t('faq.questions.payment.a'), tab: 'sellers' },
  { question: t('faq.questions.address.q'), answer: t('faq.questions.address.a'), tab: 'sellers' },
  { question: t('faq.questions.shareFlyer.q'), answer: t('faq.questions.shareFlyer.a'), tab: 'sellers' },
  { question: t('faq.questions.sellerRating.q'), answer: t('faq.questions.sellerRating.a'), tab: 'sellers' },
  { question: t('faq.questions.free.q'), answer: t('faq.questions.free.a'), tab: 'sellers' },
  { question: t('faq.questions.schedule.q'), answer: t('faq.questions.schedule.a'), tab: 'sellers' },
  { question: t('faq.questions.noGarage.q'), answer: t('faq.questions.noGarage.a'), tab: 'sellers' },
  { question: t('faq.questions.howBuyersFind.q'), answer: t('faq.questions.howBuyersFind.a'), tab: 'buyers' },
  { question: t('faq.questions.pickup.q'), answer: t('faq.questions.pickup.a'), tab: 'buyers' },
  { question: t('faq.questions.qrCode.q'), answer: t('faq.questions.qrCode.a'), tab: 'buyers' },
  { question: t('faq.questions.credits.q'), answer: t('faq.questions.credits.a'), tab: 'buyers' },
  { question: t('faq.questions.calendar.q'), answer: t('faq.questions.calendar.a'), tab: 'buyers' },
  { question: t('faq.questions.difference.q'), answer: t('faq.questions.difference.a'), tab: 'all' },
];

function GuideCard({ guide, t }) {
  return (
    <Link to={createPageUrl(guide.page)}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 group h-full">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${guide.color} mb-4`}>
          <guide.icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-[#2E3A59] dark:text-white mb-2 group-hover:text-[#FF6F61] transition-colors" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {t(`guides.cards.${guide.id}.title`)}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {t(`guides.cards.${guide.id}.description`)}
        </p>
        <div className="flex items-center text-[#FF6F61] font-medium text-sm">
          {t('guides.readMore')}
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

function FeatureCard({ feature }) {
  const Icon = feature.icon;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-md flex gap-4">
      <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl flex-shrink-0 ${feature.color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-bold text-[#2E3A59] dark:text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {feature.title}
        </h4>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

export default function Guides() {
  const [language, setLanguage] = useState('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('sellers');
  const [faqTab, setFaqTab] = useState('sellers');
  const t = useTranslation(language);
  const allFaqData = getFaqData(t);
  const sellerFeatures = getSellerFeatures(language);
  const buyerFeatures = getBuyerFeatures(language);

  useEffect(() => {
    const savedLang = localStorage.getItem('stooplify_lang') || 'en';
    setLanguage(savedLang);
    const handleLanguageChange = (e) => setLanguage(e.detail);
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const filteredFaqs = allFaqData.filter(faq => {
    const matchesTab = faqTab === 'all' || faq.tab === faqTab || faq.tab === 'all';
    const matchesSearch = !searchTerm || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Always include ALL FAQs in structured data so search engines index everything
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allFaqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
    }))
  };

  const tabClass = (tab) =>
    `px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
      activeTab === tab
        ? 'bg-[#FF6F61] text-white shadow'
        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`;

  const faqTabClass = (tab) =>
    `px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
      faqTab === tab
        ? 'bg-[#14B8FF] text-white shadow'
        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`;

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900">
      <SEO 
        title="Yard Sale Guides & FAQ | How to Host, Find & Use Stooplify"
        description="Complete guides for yard sale buyers and sellers. Learn how to list a sale, print a flyer, share with QR codes, find local garage sales near you, and earn credits on Stooplify."
        keywords="yard sale guide, how to host a yard sale, garage sale tips, how to find yard sales near me, yard sale QR code, print yard sale flyer, yard sale FAQ, how to list a garage sale, stooplify guide, sell items locally, buy at yard sales"
        structuredData={structuredData}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF6F61]/10 rounded-2xl mb-4">
            <Book className="w-8 h-8 text-[#FF6F61]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#2E3A59] dark:text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {t('guides.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            {t('guides.subtitle')}
          </p>
        </motion.div>

        {/* Buyer / Seller Tab Toggle */}
        <div className="flex justify-center gap-3 mb-8">
          <button className={tabClass('sellers')} onClick={() => setActiveTab('sellers')}>🏷️ For Sellers</button>
          <button className={tabClass('buyers')} onClick={() => setActiveTab('buyers')}>🛍️ For Buyers</button>
        </div>

        {/* Seller Section - always rendered for SEO, visually hidden when not active */}
        <section aria-label="Seller guides" style={{ display: activeTab === 'sellers' ? 'block' : 'none' }}>
          <motion.div key="sellers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              How to Host a Yard Sale with Stooplify
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              List your garage sale, stoop sale, or estate sale in minutes. Reach local buyers with QR codes, printable flyers, social sharing, and smart neighborhood alerts.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-10">
              {sellerFeatures.map((f, i) => <FeatureCard key={i} feature={f} />)}
            </div>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Yard Sale Seller Guides
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              In-depth tips on advertising, timing, permits, pricing, and more — everything you need to host a successful yard sale in NYC or your neighborhood.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sellerGuides.map((guide, index) => (
                <motion.div key={guide.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}>
                  <GuideCard guide={guide} t={t} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Buyer Section - always rendered for SEO, visually hidden when not active */}
        <section aria-label="Buyer guides" style={{ display: activeTab === 'buyers' ? 'block' : 'none' }}>
          <motion.div key="buyers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              How to Find Yard Sales Near You with Stooplify
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Browse local yard sales on the map, scan QR codes to verify attendance and earn credits, get smart alerts for new sales in your area, and message sellers directly.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-10">
              {buyerFeatures.map((f, i) => <FeatureCard key={i} feature={f} />)}
            </div>

            <h2 className="text-2xl font-bold text-[#2E3A59] dark:text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Yard Sale Buyer Guides
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Tips on where to find the best local garage sales, estate sales, and stoop sales this weekend near you.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {buyerGuides.map((guide, index) => (
                <motion.div key={guide.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}>
                  <GuideCard guide={guide} t={t} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* FAQ Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-16 mb-12">
          <h2 className="text-3xl font-bold text-[#2E3A59] dark:text-white mb-3 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {t('faq.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6 max-w-2xl mx-auto">
            {t('faq.subtitle')}
          </p>

          {/* FAQ Tab + Search */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6 max-w-3xl mx-auto">
            <div className="flex gap-2">
              <button className={faqTabClass('sellers')} onClick={() => setFaqTab('sellers')}>🏷️ Sellers</button>
              <button className={faqTabClass('buyers')} onClick={() => setFaqTab('buyers')}>🛍️ Buyers</button>
              <button className={faqTabClass('all')} onClick={() => setFaqTab('all')}>All</button>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder={t('faq.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-5 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>
          </div>

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
                      <span className="text-left font-semibold text-[#2E3A59] dark:text-white">{faq.question}</span>
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-[#14B8FF] to-[#2E3A59] rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {t('faq.contactTitle')}
          </h3>
          <p className="mb-4 opacity-90">{t('faq.contactSubtitle')}</p>
          <a href="mailto:daniel@stooplify.com" className="inline-block px-6 py-3 bg-white text-[#14B8FF] rounded-xl font-semibold hover:bg-gray-100 transition-colors">
            {t('faq.contactButton')}
          </a>
        </motion.div>
      </div>
    </div>
  );
}