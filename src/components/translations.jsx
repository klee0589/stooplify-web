export const translations = {
  en: {
    // Header
    home: 'Home',
    browseSales: 'Browse Yard Sales',
    listSale: 'List a Yard Sale',
    pricing: 'Pricing',
    favorites: 'Favorites',
    profile: 'Profile',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    getStarted: 'Get Started',
    
    // Hero
    heroTitle: 'Discover Amazing Yard Sales Near You',
    heroSubtitle: 'Find hidden treasures, great deals, and unique items at local yard sales in your neighborhood',
    findSales: 'Find Sales',
    listYourSale: 'List Your Sale',
    
    // How It Works
    howItWorks: 'How It Works',
    step1Title: 'Browse Sales',
    step1Desc: 'Discover yard sales happening near you',
    step2Title: 'Save Favorites',
    step2Desc: 'Mark sales you want to visit',
    step3Title: 'Get Directions',
    step3Desc: 'Navigate to sales on the day',
    
    // Featured Sales
    featuredSales: 'Featured Yard Sales',
    viewAllSales: 'View All Sales',
    
    // Footer
    quickLinks: 'Quick Links',
    legal: 'Legal',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    contactUs: 'Contact Us',
    allRightsReserved: 'All rights reserved',
    
    // Common
    loading: 'Loading...',
    saleFound: 'sales found',
    noSales: 'No sales found',
  },
  es: {
    // Header
    home: 'Inicio',
    browseSales: 'Ver Ventas de Garaje',
    listSale: 'Publicar una Venta',
    pricing: 'Precios',
    favorites: 'Favoritos',
    profile: 'Perfil',
    signIn: 'Iniciar Sesión',
    signOut: 'Cerrar Sesión',
    getStarted: 'Comenzar',
    
    // Hero
    heroTitle: 'Descubre Increíbles Ventas de Garaje Cerca de Ti',
    heroSubtitle: 'Encuentra tesoros ocultos, grandes ofertas y artículos únicos en ventas de garaje locales en tu vecindario',
    findSales: 'Buscar Ventas',
    listYourSale: 'Publicar tu Venta',
    
    // How It Works
    howItWorks: 'Cómo Funciona',
    step1Title: 'Explorar Ventas',
    step1Desc: 'Descubre ventas de garaje cerca de ti',
    step2Title: 'Guardar Favoritos',
    step2Desc: 'Marca las ventas que quieres visitar',
    step3Title: 'Obtener Direcciones',
    step3Desc: 'Navega a las ventas el día del evento',
    
    // Featured Sales
    featuredSales: 'Ventas de Garaje Destacadas',
    viewAllSales: 'Ver Todas las Ventas',
    
    // Footer
    quickLinks: 'Enlaces Rápidos',
    legal: 'Legal',
    privacyPolicy: 'Política de Privacidad',
    termsOfService: 'Términos de Servicio',
    contactUs: 'Contáctanos',
    allRightsReserved: 'Todos los derechos reservados',
    
    // Common
    loading: 'Cargando...',
    saleFound: 'ventas encontradas',
    noSales: 'No se encontraron ventas',
  }
};

export const useTranslation = (lang = 'en') => {
  return (key) => translations[lang]?.[key] || translations.en[key] || key;
};