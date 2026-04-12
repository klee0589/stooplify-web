import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import BlogSlug from '../pages/BlogSlug';
import StoopSalesBrooklyn from '../pages/StoopSalesBrooklyn';
import StoopSalesQueens from '../pages/StoopSalesQueens';
import StoopSalesManhattan from '../pages/StoopSalesManhattan';
import StoopSalesBronx from '../pages/StoopSalesBronx';
import StoopSalesJerseyCity from '../pages/StoopSalesJerseyCity';
import GarageSalesLosAngeles from '../pages/GarageSalesLosAngeles';
import GarageSalesSanFrancisco from '../pages/GarageSalesSanFrancisco';
import StoopSalesNYCWeekend from '../pages/StoopSalesNYCWeekend';
import BrooklynStoopSalesWeekend from '../pages/BrooklynStoopSalesWeekend';
import YardSalesNearMeWeekend from '../pages/YardSalesNearMeWeekend';
import SalePage from '../pages/SalePage';
import SellerPage from '../pages/SellerPage';
import NeighborhoodLandingPage from '../components/seo/NeighborhoodLandingPage';
import DateLandingPage from '../components/seo/DateLandingPage';
import CategoryLandingPage from '../components/seo/CategoryLandingPage';


export default function PageNotFound({}) {
    const location = useLocation();
    const pageName = location.pathname.substring(1);

    const { data: authData, isFetched } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            try {
                const user = await base44.auth.me();
                return { user, isAuthenticated: true };
            } catch (error) {
                return { user: null, isAuthenticated: false };
            }
        }
    });

    // Handle /blog/:slug clean URLs
    if (location.pathname.startsWith('/blog/') && location.pathname.length > 6) {
        return <BlogSlug />;
    }

    // Handle /sale/:slug clean URLs
    if (location.pathname.startsWith('/sale/') && location.pathname.length > 6) {
        return <SalePage />;
    }

    // Handle /seller/:username
    if (location.pathname.startsWith('/seller/') && location.pathname.length > 8) {
        return <SellerPage />;
    }

    // Handle SEO city & weekend landing pages via clean URL paths
    const seoPageMap = {
        'stoop-sales-brooklyn': StoopSalesBrooklyn,
        'stoop-sales-queens': StoopSalesQueens,
        'stoop-sales-manhattan': StoopSalesManhattan,
        'stoop-sales-bronx': StoopSalesBronx,
        'stoop-sales-jersey-city': StoopSalesJerseyCity,
        'garage-sales-los-angeles': GarageSalesLosAngeles,
        'garage-sales-san-francisco': GarageSalesSanFrancisco,
        'stoop-sales-nyc-this-weekend': StoopSalesNYCWeekend,
        'brooklyn-stoop-sales-this-weekend': BrooklynStoopSalesWeekend,
        'yard-sales-near-me-this-weekend': YardSalesNearMeWeekend,
    };

    if (seoPageMap[pageName]) {
        const SeoComp = seoPageMap[pageName];
        return <SeoComp />;
    }

    // Neighborhood pages: /stoop-sales-{neighborhood}-{city}
    const neighborhoodRoutes = {
        'stoop-sales-williamsburg-brooklyn': { neighborhood: 'Williamsburg', city: 'Brooklyn', state: 'NY' },
        'stoop-sales-park-slope-brooklyn': { neighborhood: 'Park Slope', city: 'Brooklyn', state: 'NY' },
        'stoop-sales-bushwick-brooklyn': { neighborhood: 'Bushwick', city: 'Brooklyn', state: 'NY' },
        'stoop-sales-bed-stuy-brooklyn': { neighborhood: 'Bed-Stuy', city: 'Brooklyn', state: 'NY' },
        'stoop-sales-crown-heights-brooklyn': { neighborhood: 'Crown Heights', city: 'Brooklyn', state: 'NY' },
        'stoop-sales-greenpoint-brooklyn': { neighborhood: 'Greenpoint', city: 'Brooklyn', state: 'NY' },
        'stoop-sales-cobble-hill-brooklyn': { neighborhood: 'Cobble Hill', city: 'Brooklyn', state: 'NY' },
        'stoop-sales-astoria-queens': { neighborhood: 'Astoria', city: 'Queens', state: 'NY' },
        'stoop-sales-jackson-heights-queens': { neighborhood: 'Jackson Heights', city: 'Queens', state: 'NY' },
        'stoop-sales-upper-west-side-manhattan': { neighborhood: 'Upper West Side', city: 'Manhattan', state: 'NY' },
        'stoop-sales-upper-east-side-manhattan': { neighborhood: 'Upper East Side', city: 'Manhattan', state: 'NY' },
        'stoop-sales-harlem-manhattan': { neighborhood: 'Harlem', city: 'Manhattan', state: 'NY' },
        'stoop-sales-west-village-manhattan': { neighborhood: 'West Village', city: 'Manhattan', state: 'NY' },
    };

    if (neighborhoodRoutes[pageName]) {
        const { neighborhood, city, state } = neighborhoodRoutes[pageName];
        const config = {
            neighborhood, city, state,
            title: `${neighborhood} Stoop Sales`,
            metaTitle: `Stoop Sales in ${neighborhood}, ${city} | Stooplify`,
            metaDescription: `Find upcoming stoop sales and yard sales in ${neighborhood}, ${city}. Browse live listings on Stooplify.`,
            keywords: `stoop sales ${neighborhood}, yard sales ${neighborhood} ${city}, garage sales ${neighborhood}`,
            h1: `Stoop Sales in ${neighborhood}, ${city}`,
            intro: `Browse upcoming stoop sales, yard sales, and garage sales happening in ${neighborhood}.`,
            canonicalUrl: `https://stooplify.com/${pageName}`,
        };
        return <NeighborhoodLandingPage config={config} />;
    }

    // Date pages: /stoop-sales-nyc-today, /stoop-sales-nyc-saturday, etc.
    const dateRoutes = {
        'stoop-sales-nyc-today': { dateFilter: 'today', locationFilter: ['brooklyn', 'queens', 'manhattan', 'bronx', 'new york'], title: 'NYC Stoop Sales Today', h1: 'NYC Stoop Sales Today' },
        'stoop-sales-nyc-tomorrow': { dateFilter: 'tomorrow', locationFilter: ['brooklyn', 'queens', 'manhattan', 'bronx', 'new york'], title: 'NYC Stoop Sales Tomorrow', h1: 'NYC Stoop Sales Tomorrow' },
        'stoop-sales-nyc-saturday': { dateFilter: 'saturday', locationFilter: ['brooklyn', 'queens', 'manhattan', 'bronx', 'new york'], title: 'NYC Stoop Sales This Saturday', h1: 'NYC Stoop Sales This Saturday' },
        'stoop-sales-nyc-sunday': { dateFilter: 'sunday', locationFilter: ['brooklyn', 'queens', 'manhattan', 'bronx', 'new york'], title: 'NYC Stoop Sales This Sunday', h1: 'NYC Stoop Sales This Sunday' },
        'garage-sales-los-angeles-today': { dateFilter: 'today', locationFilter: ['los angeles', 'la'], title: 'Los Angeles Garage Sales Today', h1: 'Garage Sales in LA Today' },
        'garage-sales-los-angeles-saturday': { dateFilter: 'saturday', locationFilter: ['los angeles', 'la'], title: 'LA Garage Sales This Saturday', h1: 'Los Angeles Garage Sales This Saturday' },
        'yard-sales-near-me-today': { dateFilter: 'today', locationFilter: null, title: 'Yard Sales Near Me Today', h1: 'Yard Sales Happening Today' },
        'yard-sales-near-me-saturday': { dateFilter: 'saturday', locationFilter: null, title: 'Yard Sales Near Me This Saturday', h1: 'Yard Sales This Saturday Near You' },
        'yard-sales-near-me-sunday': { dateFilter: 'sunday', locationFilter: null, title: 'Yard Sales Near Me This Sunday', h1: 'Yard Sales This Sunday Near You' },
    };

    if (dateRoutes[pageName]) {
        const { dateFilter, locationFilter, title, h1 } = dateRoutes[pageName];
        const config = {
            dateFilter, locationFilter, title, h1,
            metaTitle: `${title} | Stooplify`,
            metaDescription: `Find ${title.toLowerCase()} on Stooplify. Live listings updated in real-time.`,
            keywords: `${title.toLowerCase()}, yard sales today, stoop sales near me`,
            intro: 'Live listings updated in real-time. Browse, plan your route, and find hidden gems.',
            canonicalUrl: `https://stooplify.com/${pageName}`,
        };
        return <DateLandingPage config={config} />;
    }

    // Category pages
    const categoryRoutes = {
        'furniture-yard-sales': { category: 'furniture', title: 'Furniture Yard Sales', h1: 'Furniture Yard Sales Near You', intro: 'Browse yard sales and stoop sales with furniture, sofas, tables, and more.' },
        'vintage-clothing-stoop-sales': { category: 'clothing', title: 'Vintage Clothing Sales', h1: 'Vintage Clothing Stoop Sales', intro: 'Find vintage clothing, fashion, and accessories at local stoop and yard sales.' },
        'book-sales': { category: 'books', title: 'Book Sales', h1: 'Book Sales Near You', intro: 'Browse yard sales with books, novels, textbooks, and rare finds.' },
        'electronics-yard-sales': { category: 'electronics', title: 'Electronics Yard Sales', h1: 'Electronics at Yard Sales Near You', intro: 'Find electronics, gadgets, and tech at local yard and garage sales.' },
        'antique-yard-sales': { category: 'antiques', title: 'Antique Yard Sales', h1: 'Antique & Vintage Yard Sales Near You', intro: 'Browse antiques, collectibles, and vintage treasures at local sales.' },
        'toy-yard-sales': { category: 'toys', title: 'Toy Sales', h1: 'Kids & Toy Sales Near You', intro: 'Find toys, games, and kids items at yard sales near you.' },
    };

    if (categoryRoutes[pageName]) {
        const { category, title, h1, intro } = categoryRoutes[pageName];
        const config = {
            category, title, h1, intro,
            metaTitle: `${title} Near You | Stooplify`,
            metaDescription: `Find ${title.toLowerCase()} near you on Stooplify. Browse live listings.`,
            keywords: `${title.toLowerCase()}, ${category} yard sale, ${category} stoop sale`,
            canonicalUrl: `https://stooplify.com/${pageName}`,
        };
        return <CategoryLandingPage config={config} />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
            <div className="max-w-md w-full">
                <div className="text-center space-y-6">
                    {/* 404 Error Code */}
                    <div className="space-y-2">
                        <h1 className="text-7xl font-light text-slate-300">404</h1>
                        <div className="h-0.5 w-16 bg-slate-200 mx-auto"></div>
                    </div>
                    
                    {/* Main Message */}
                    <div className="space-y-3">
                        <h2 className="text-2xl font-medium text-slate-800">
                            Page Not Found
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            The page <span className="font-medium text-slate-700">"{pageName}"</span> could not be found in this application.
                        </p>
                    </div>
                    
                    {/* Admin Note */}
                    {isFetched && authData.isAuthenticated && authData.user?.role === 'admin' && (
                        <div className="mt-8 p-4 bg-slate-100 rounded-lg border border-slate-200">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                                </div>
                                <div className="text-left space-y-1">
                                    <p className="text-sm font-medium text-slate-700">Admin Note</p>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        This could mean that the AI hasn't implemented this page yet. Ask it to implement it in the chat.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Action Button */}
                    <div className="pt-6">
                        <button 
                            onClick={() => window.location.href = '/'} 
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}