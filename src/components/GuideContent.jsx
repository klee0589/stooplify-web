// Individual guide page content components with translations
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ChevronRight } from 'lucide-react';
import { useTranslation } from './translations';
import { base44 } from '@/api/base44Client';
import WeekendAlertSignup from './WeekendAlertSignup';

export function useGuideLanguage() {
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

  return language;
}

export function GuideBreadcrumbs({ language, currentPage }) {
  const t = useTranslation(language);
  
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
      <Link to="/" className="hover:text-[#FF6F61] flex items-center gap-1">
        <Home className="w-4 h-4" />
        {t('home')}
      </Link>
      <ChevronRight className="w-4 h-4" />
      <Link to="/guides" className="hover:text-[#FF6F61]">
        {language === 'en' ? 'Guides' : 'Guías'}
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-[#2E3A59] font-medium">{currentPage}</span>
    </nav>
  );
}

export const guideContent = {
  en: {
    advertise: {
      breadcrumb: 'Advertise Your Sale',
      title: 'How to Advertise a Yard Sale in NYC (Free & Easy)',
      sections: [
        {
          type: 'text',
          content: 'Hosting a yard sale in New York City — whether in Brooklyn, Queens, Manhattan, or the Bronx — is a great way to clean out your home and make extra cash. But getting people to actually show up can be tough.'
        },
        {
          type: 'text',
          content: `Between busy NYC streets, crowded neighborhoods, and disappearing flyers, many great yard sales get missed. That's why advertising your sale the right way matters for reaching local buyers.`
        },
        {
          type: 'heading',
          content: 'Traditional Ways People Advertise Yard Sales'
        },
        {
          type: 'text',
          content: 'Most people start with:'
        },
        {
          type: 'list',
          items: ['Handwritten signs on lamp posts', 'Word of mouth with neighbors', 'Posting in Facebook groups']
        },
        {
          type: 'text',
          content: `These work… sometimes. But signs get taken down, posts get buried, and not everyone checks social media every day.`
        },
        {
          type: 'heading',
          content: 'A Better Way to Reach Local Buyers'
        },
        {
          type: 'text',
          content: 'Stooplify helps you advertise your yard sale to people already looking for one nearby.'
        },
        {
          type: 'text',
          content: 'With Stooplify, you can:'
        },
        {
          type: 'list',
          items: ['List your yard sale in minutes', 'Add photos and descriptions', 'Choose the date and time', 'Show up on a map for local shoppers']
        },
        {
          type: 'text',
          content: 'No printing signs. No chasing group admins. Just post and go.'
        },
        {
          type: 'heading',
          content: 'Why Stooplify Works Better'
        },
        {
          type: 'text',
          content: 'People open Stooplify because they want to:'
        },
        {
          type: 'list',
          items: ['Find yard sales happening now', 'Plan weekend thrifting', 'Discover local deals']
        },
        {
          type: 'text',
          content: 'That means better buyers and more foot traffic for your sale.'
        }
      ],
      cta: '👉 List your yard sale on Stooplify',
      ctaUrl: '/add-yard-sale'
    },
    timing: {
      breadcrumb: 'Best Times',
      title: 'Best Days & Times to Host a Yard Sale',
      sections: [
        {
          type: 'text',
          content: `Timing can make or break a yard sale. Even great items won't sell if no one shows up.`
        },
        {
          type: 'heading',
          content: 'Best Days of the Week'
        },
        {
          type: 'list',
          items: ['Saturday is the best day', 'Sunday works, but mornings are key', 'Weekdays are usually slower unless in busy areas']
        },
        {
          type: 'heading',
          content: 'Best Times'
        },
        {
          type: 'list',
          items: ['Start early: 8:00–9:00 AM', 'Most buyers come before noon', 'End around 2:00–3:00 PM']
        },
        {
          type: 'heading',
          content: 'Seasonal Tips'
        },
        {
          type: 'list',
          items: ['Spring and summer get the most traffic', 'Avoid rainy days if possible', 'Holiday weekends can be hit or miss']
        },
        {
          type: 'heading',
          content: 'NYC Neighborhood Tip'
        },
        {
          type: 'text',
          content: `If you're in Queens, Brooklyn, or dense areas, buyers often walk — so visibility and timing matter even more.`
        },
        {
          type: 'text',
          content: 'Posting your sale ahead of time on Stooplify lets people plan their visit before the weekend.'
        }
      ],
      cta: '👉 Schedule your yard sale on Stooplify',
      ctaUrl: '/add-yard-sale'
    },
    permit: {
      breadcrumb: 'NYC Permits',
      title: 'Do You Need a Permit for a Yard Sale in New York?',
      sections: [
        {
          type: 'text',
          content: 'This is a common question — and the answer depends on how you run your sale.'
        },
        {
          type: 'heading',
          content: 'The Short Answer'
        },
        {
          type: 'text',
          content: 'Most small, casual yard sales do not require a permit if:'
        },
        {
          type: 'list',
          items: [`You're not blocking sidewalks`, `You're not creating noise issues`, `You're selling personal items`]
        },
        {
          type: 'heading',
          content: 'Things to Avoid'
        },
        {
          type: 'list',
          items: ['Blocking pedestrian traffic', 'Using amplified music', 'Turning it into a recurring business']
        },
        {
          type: 'text',
          content: `If you're unsure, keeping your sale simple and low-key is the safest approach.`
        },
        {
          type: 'heading',
          content: 'Safer Option'
        },
        {
          type: 'text',
          content: 'Listing your sale online lets people find you without creating crowds or clutter.'
        },
        {
          type: 'text',
          content: 'Stooplify helps keep things local, calm, and community-friendly.'
        }
      ],
      cta: '👉 View yard sales happening this weekend',
      ctaUrl: '/yard-sales'
    },
    pricing: {
      breadcrumb: 'Pricing Tips',
      title: 'How to Price Items for a Yard Sale',
      sections: [
        {
          type: 'text',
          content: `Pricing doesn't have to be stressful.`
        },
        {
          type: 'heading',
          content: 'Simple Pricing Rules'
        },
        {
          type: 'list',
          items: ['Most items: 25–30% of retail price', 'Clothes: $1–$5', 'Books: $1–$2', 'Small furniture: price to move, not to store']
        },
        {
          type: 'heading',
          content: 'Pro Tips'
        },
        {
          type: 'list',
          items: ['Round prices make cash easier', `Expect negotiation — it's part of the fun`, 'Lower prices later in the day']
        },
        {
          type: 'text',
          content: 'Photos on your Stooplify listing help buyers decide before they arrive, saving everyone time.'
        },
        {
          type: 'heading',
          content: 'When Items Aren\'t Selling: Go Free'
        },
        {
          type: 'text',
          content: 'If items aren\'t selling at your price, don\'t wait — mark them FREE to attract quick pickups. Free items on Stooplify get claimed fast, especially furniture, books, and baby gear. This is especially useful at the end of the day when you want to clear out. Post a Freebie listing and let neighbors grab what\'s left.'
        }
      ],
      cta: '👉 List your yard sale with photos',
      ctaUrl: '/add-yard-sale'
    },
    seniors: {
      breadcrumb: 'For Seniors',
      title: 'How Seniors Can Post a Yard Sale Online',
      sections: [
        {
          type: 'text',
          content: `You don't need to be tech-savvy to post a yard sale.`
        },
        {
          type: 'text',
          content: 'Stooplify is designed to be simple.'
        },
        {
          type: 'heading',
          content: 'What You Need'
        },
        {
          type: 'list',
          items: ['Address or nearest intersection', 'Date and time', 'Short description (optional)', 'Photos (optional but helpful)']
        },
        {
          type: 'text',
          content: `That's it.`
        },
        {
          type: 'heading',
          content: 'Why This Helps'
        },
        {
          type: 'list',
          items: ['Fewer phone calls', 'Less confusion', 'Better buyers']
        },
        {
          type: 'text',
          content: 'Family members can also help create the listing in minutes.'
        }
      ],
      cta: '👉 Create a simple yard sale listing',
      ctaUrl: '/add-yard-sale'
    },
    find: {
      breadcrumb: 'Find Sales',
      title: 'Where to Find Yard Sales Near You This Weekend',
      sections: [
        {
          type: 'text',
          content: `Finding yard sales shouldn't feel like a scavenger hunt.`
        },
        {
          type: 'heading',
          content: `Why They're Hard to Find`
        },
        {
          type: 'list',
          items: ['Facebook posts get buried', 'Craigslist is cluttered', 'Signs disappear']
        },
        {
          type: 'heading',
          content: 'Stooplify Makes It Easy'
        },
        {
          type: 'list',
          items: ['Browse nearby sales', 'View on a map or list', 'See photos, dates, and times']
        },
        {
          type: 'text',
          content: `Whether you're hunting deals or just love thrifting, Stooplify keeps everything in one place.`
        }
      ],
      cta: '👉 Browse yard sales near you',
      ctaUrl: '/yard-sales'
    }
  },
  es: {
    advertise: {
      breadcrumb: 'Anuncia Tu Venta',
      title: 'Cómo Anunciar una Venta de Garaje en NYC (Gratis y Fácil)',
      sections: [
        {
          type: 'text',
          content: 'Organizar una venta de garaje en la Ciudad de Nueva York — ya sea en Brooklyn, Queens, Manhattan o el Bronx — es una excelente manera de limpiar tu hogar y ganar dinero extra. Pero lograr que la gente realmente aparezca puede ser difícil.'
        },
        {
          type: 'text',
          content: 'Entre las calles concurridas de NYC, los vecindarios abarrotados y los volantes que desaparecen, muchas excelentes ventas de garaje pasan desapercibidas. Por eso es importante anunciar tu venta de la manera correcta para llegar a compradores locales.'
        },
        {
          type: 'heading',
          content: 'Formas Tradicionales de Anunciar Ventas de Garaje'
        },
        {
          type: 'text',
          content: 'La mayoría de la gente comienza con:'
        },
        {
          type: 'list',
          items: ['Letreros escritos a mano en postes', 'Boca a boca con vecinos', 'Publicaciones en grupos de Facebook']
        },
        {
          type: 'text',
          content: 'Esto funciona... a veces. Pero los letreros se quitan, las publicaciones se entierran y no todos revisan las redes sociales todos los días.'
        },
        {
          type: 'heading',
          content: 'Una Mejor Manera de Llegar a Compradores Locales'
        },
        {
          type: 'text',
          content: 'Stooplify te ayuda a anunciar tu venta de garaje a personas que ya están buscando una cerca.'
        },
        {
          type: 'text',
          content: 'Con Stooplify, puedes:'
        },
        {
          type: 'list',
          items: ['Listar tu venta de garaje en minutos', 'Agregar fotos y descripciones', 'Elegir la fecha y hora', 'Aparecer en un mapa para compradores locales']
        },
        {
          type: 'text',
          content: 'Sin imprimir letreros. Sin perseguir administradores de grupos. Solo publica y listo.'
        },
        {
          type: 'heading',
          content: 'Por Qué Stooplify Funciona Mejor'
        },
        {
          type: 'text',
          content: 'La gente abre Stooplify porque quiere:'
        },
        {
          type: 'list',
          items: ['Encontrar ventas de garaje que suceden ahora', 'Planificar compras de fin de semana', 'Descubrir ofertas locales']
        },
        {
          type: 'text',
          content: 'Eso significa mejores compradores y más tráfico para tu venta.'
        }
      ],
      cta: '👉 Lista tu venta de garaje en Stooplify',
      ctaUrl: '/add-yard-sale'
    },
    timing: {
      breadcrumb: 'Mejores Horarios',
      title: 'Mejores Días y Horarios para Organizar una Venta de Garaje',
      sections: [
        {
          type: 'text',
          content: 'El momento puede hacer o deshacer una venta de garaje. Incluso los mejores artículos no se venderán si nadie aparece.'
        },
        {
          type: 'heading',
          content: 'Mejores Días de la Semana'
        },
        {
          type: 'list',
          items: ['El sábado es el mejor día', 'El domingo funciona, pero las mañanas son clave', 'Los días de semana suelen ser más lentos a menos que estés en áreas concurridas']
        },
        {
          type: 'heading',
          content: 'Mejores Horarios'
        },
        {
          type: 'list',
          items: ['Comienza temprano: 8:00–9:00 AM', 'La mayoría de los compradores vienen antes del mediodía', 'Termina alrededor de las 2:00–3:00 PM']
        },
        {
          type: 'heading',
          content: 'Consejos de Temporada'
        },
        {
          type: 'list',
          items: ['La primavera y el verano obtienen más tráfico', 'Evita los días lluviosos si es posible', 'Los fines de semana festivos pueden ser impredecibles']
        },
        {
          type: 'heading',
          content: 'Consejo para Vecindarios de NYC'
        },
        {
          type: 'text',
          content: 'Si estás en Queens, Brooklyn o áreas densas, los compradores a menudo caminan — así que la visibilidad y el momento importan aún más.'
        },
        {
          type: 'text',
          content: 'Publicar tu venta con anticipación en Stooplify permite que la gente planifique su visita antes del fin de semana.'
        }
      ],
      cta: '👉 Programa tu venta de garaje en Stooplify',
      ctaUrl: '/add-yard-sale'
    },
    permit: {
      breadcrumb: 'Permisos NYC',
      title: '¿Necesitas un Permiso para una Venta de Garaje en Nueva York?',
      sections: [
        {
          type: 'text',
          content: 'Esta es una pregunta común — y la respuesta depende de cómo organices tu venta.'
        },
        {
          type: 'heading',
          content: 'La Respuesta Corta'
        },
        {
          type: 'text',
          content: 'La mayoría de las ventas de garaje pequeñas y casuales no requieren un permiso si:'
        },
        {
          type: 'list',
          items: ['No estás bloqueando las aceras', 'No estás creando problemas de ruido', 'Estás vendiendo artículos personales']
        },
        {
          type: 'heading',
          content: 'Cosas a Evitar'
        },
        {
          type: 'list',
          items: ['Bloquear el tráfico peatonal', 'Usar música amplificada', 'Convertirlo en un negocio recurrente']
        },
        {
          type: 'text',
          content: 'Si no estás seguro, mantener tu venta simple y discreta es el enfoque más seguro.'
        },
        {
          type: 'heading',
          content: 'Opción Más Segura'
        },
        {
          type: 'text',
          content: 'Listar tu venta en línea permite que la gente te encuentre sin crear multitudes o desorden.'
        },
        {
          type: 'text',
          content: 'Stooplify ayuda a mantener las cosas locales, tranquilas y amigables con la comunidad.'
        }
      ],
      cta: '👉 Ver ventas de garaje este fin de semana',
      ctaUrl: '/yard-sales'
    },
    pricing: {
      breadcrumb: 'Consejos de Precios',
      title: 'Cómo Poner Precios a los Artículos para una Venta de Garaje',
      sections: [
        {
          type: 'text',
          content: 'Poner precios no tiene que ser estresante.'
        },
        {
          type: 'heading',
          content: 'Reglas Simples de Precios'
        },
        {
          type: 'list',
          items: ['La mayoría de los artículos: 25–30% del precio minorista', 'Ropa: $1–$5', 'Libros: $1–$2', 'Muebles pequeños: precio para mover, no para almacenar']
        },
        {
          type: 'heading',
          content: 'Consejos Profesionales'
        },
        {
          type: 'list',
          items: ['Los precios redondeados facilitan el efectivo', 'Espera negociación — es parte de la diversión', 'Baja los precios más tarde en el día']
        },
        {
          type: 'text',
          content: 'Las fotos en tu listado de Stooplify ayudan a los compradores a decidir antes de llegar, ahorrando tiempo a todos.'
        }
      ],
      cta: '👉 Lista tu venta de garaje con fotos',
      ctaUrl: '/add-yard-sale'
    },
    seniors: {
      breadcrumb: 'Para Adultos Mayores',
      title: 'Cómo los Adultos Mayores Pueden Publicar una Venta de Garaje en Línea',
      sections: [
        {
          type: 'text',
          content: 'No necesitas ser experto en tecnología para publicar una venta de garaje.'
        },
        {
          type: 'text',
          content: 'Stooplify está diseñado para ser simple.'
        },
        {
          type: 'heading',
          content: 'Lo Que Necesitas'
        },
        {
          type: 'list',
          items: ['Dirección o intersección más cercana', 'Fecha y hora', 'Descripción breve (opcional)', 'Fotos (opcionales pero útiles)']
        },
        {
          type: 'text',
          content: `Eso es todo.`
        },
        {
          type: 'heading',
          content: 'Por Qué Esto Ayuda'
        },
        {
          type: 'list',
          items: ['Menos llamadas telefónicas', 'Menos confusión', 'Mejores compradores']
        },
        {
          type: 'text',
          content: 'Los miembros de la familia también pueden ayudar a crear el listado en minutos.'
        }
      ],
      cta: '👉 Crea un listado simple de venta de garaje',
      ctaUrl: '/add-yard-sale'
    },
    find: {
      breadcrumb: 'Buscar Ventas',
      title: 'Dónde Encontrar Ventas de Garaje Cerca de Ti Este Fin de Semana',
      sections: [
        {
          type: 'text',
          content: 'Encontrar ventas de garaje no debería sentirse como una búsqueda del tesoro.'
        },
        {
          type: 'heading',
          content: 'Por Qué Son Difíciles de Encontrar'
        },
        {
          type: 'list',
          items: ['Las publicaciones de Facebook se entierran', 'Craigslist está desordenado', 'Los letreros desaparecen']
        },
        {
          type: 'heading',
          content: 'Stooplify lo Hace Fácil'
        },
        {
          type: 'list',
          items: ['Navega ventas cercanas', 'Ver en un mapa o lista', 'Ver fotos, fechas y horarios']
        },
        {
          type: 'text',
          content: 'Ya sea que estés buscando ofertas o simplemente ames las compras de segunda mano, Stooplify mantiene todo en un solo lugar.'
        }
      ],
      cta: '👉 Navega ventas de garaje cerca de ti',
      ctaUrl: '/yard-sales'
    }
  }
};

export function GuideContent({ guide, image }) {
  const language = useGuideLanguage();
  const content = guideContent[language][guide];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl overflow-hidden shadow-lg"
    >
      <img 
        src={image} 
        alt={content.title}
        className="w-full h-64 object-cover"
      />
      
      <div className="p-8 md:p-12">
        <GuideBreadcrumbs language={language} currentPage={content.breadcrumb} />

        <h1 className="text-3xl md:text-4xl font-bold text-[#2E3A59] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {content.title}
        </h1>

        <div className="prose prose-lg max-w-none">
          {content.sections.map((section, index) => {
            if (section.type === 'text') {
              return <p key={index} className="text-gray-700 leading-relaxed mb-6">{section.content}</p>;
            }
            if (section.type === 'heading') {
              return <h2 key={index} className="text-2xl font-bold text-[#2E3A59] mt-8 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>{section.content}</h2>;
            }
            if (section.type === 'list') {
              return (
                <ul key={index} className="space-y-2 mb-6 text-gray-700">
                  {section.items.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              );
            }
            return null;
          })}

          <div className="mt-12 pt-8 border-t border-gray-200 space-y-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={content.ctaUrl}
                onClick={() => base44.analytics.track({ eventName: 'guide_cta_clicked', properties: { guide, cta: 'primary' } })}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-[#FF6F61] text-white rounded-xl font-semibold shadow-lg whitespace-nowrap"
                >
                  {content.cta}
                </motion.button>
              </Link>
              <Link
                to="/yard-sales"
                onClick={() => base44.analytics.track({ eventName: 'guide_cta_clicked', properties: { guide, cta: 'browse_sales' } })}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-[#14B8FF] text-white rounded-xl font-semibold shadow-lg whitespace-nowrap"
                >
                  🗺️ Browse This Weekend's Sales
                </motion.button>
              </Link>
            </div>

            {/* Weekend alert signup */}
            <WeekendAlertSignup variant="banner" />

            {/* Internal links */}
            <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-sm font-semibold text-[#2E3A59] mb-3">🔗 Related Guides & Pages</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <Link to="/add-yard-sale" className="text-[#FF6F61] hover:underline">→ List Your Sale Free</Link>
                <Link to="/guides-find-yard-sales" className="text-[#14B8FF] hover:underline">→ Finding Yard Sales</Link>
                <Link to="/guides-advertise-yard-sale" className="text-gray-600 hover:text-[#14B8FF]">→ How to Advertise</Link>
                <Link to="/guides-pricing-yard-sale-items" className="text-gray-600 hover:text-[#14B8FF]">→ Pricing Your Items</Link>
                <Link to="/stoop-sales-brooklyn" className="text-gray-600 hover:text-[#14B8FF]">→ Brooklyn Stoop Sales</Link>
                <Link to="/garage-sales-nyc" className="text-gray-600 hover:text-[#14B8FF]">→ NYC Garage Sales</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}