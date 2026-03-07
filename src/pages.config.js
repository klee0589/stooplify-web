/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AddYardSale from './pages/AddYardSale';
import AdminCommunityLocations from './pages/AdminCommunityLocations';
import AdminSupabaseSync from './pages/AdminSupabaseSync';
import ApplyAsShop from './pages/ApplyAsShop';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import BlogSlug from './pages/BlogSlug';
import BrooklynStoopSalesWeekend from './pages/BrooklynStoopSalesWeekend';
import Calendar from './pages/Calendar';
import ChatSupport from './pages/ChatSupport';
import Favorites from './pages/Favorites';
import GarageSalesLosAngeles from './pages/GarageSalesLosAngeles';
import GarageSalesSanFrancisco from './pages/GarageSalesSanFrancisco';
import Guides from './pages/Guides';
import GuidesAdvertise from './pages/GuidesAdvertise';
import GuidesFindSales from './pages/GuidesFindSales';
import GuidesPermit from './pages/GuidesPermit';
import GuidesPricing from './pages/GuidesPricing';
import GuidesSeniors from './pages/GuidesSeniors';
import GuidesTimings from './pages/GuidesTimings';
import Home from './pages/Home';
import Legal from './pages/Legal';
import Messages from './pages/Messages';
import MyYardSales from './pages/MyYardSales';
import Pricing from './pages/Pricing';
import Profile from './pages/Profile';
import SalePage from './pages/SalePage';
import SellerPage from './pages/SellerPage';
import StoopSalesBronx from './pages/StoopSalesBronx';
import StoopSalesBrooklyn from './pages/StoopSalesBrooklyn';
import StoopSalesJerseyCity from './pages/StoopSalesJerseyCity';
import StoopSalesManhattan from './pages/StoopSalesManhattan';
import StoopSalesNYCWeekend from './pages/StoopSalesNYCWeekend';
import StoopSalesQueens from './pages/StoopSalesQueens';
import YardSaleDetails from './pages/YardSaleDetails';
import YardSales from './pages/YardSales';
import YardSalesNearMeWeekend from './pages/YardSalesNearMeWeekend';
import addYardSale from './pages/add-yard-sale';
import guidesAdvertiseYardSale from './pages/guides-advertise-yard-sale';
import guidesBestTimeYardSale from './pages/guides-best-time-yard-sale';
import guidesFindYardSales from './pages/guides-find-yard-sales';
import guidesPermitRequirementsNyc from './pages/guides-permit-requirements-nyc';
import guidesPricingYardSaleItems from './pages/guides-pricing-yard-sale-items';
import guidesSeniorsYardSales from './pages/guides-seniors-yard-sales';
import guides from './pages/guides';
import myYardSales from './pages/my-yard-sales';
import yardSales from './pages/yard-sales';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AddYardSale": AddYardSale,
    "AdminCommunityLocations": AdminCommunityLocations,
    "AdminSupabaseSync": AdminSupabaseSync,
    "ApplyAsShop": ApplyAsShop,
    "Blog": Blog,
    "BlogPost": BlogPost,
    "BlogSlug": BlogSlug,
    "BrooklynStoopSalesWeekend": BrooklynStoopSalesWeekend,
    "Calendar": Calendar,
    "ChatSupport": ChatSupport,
    "Favorites": Favorites,
    "GarageSalesLosAngeles": GarageSalesLosAngeles,
    "GarageSalesSanFrancisco": GarageSalesSanFrancisco,
    "Guides": Guides,
    "GuidesAdvertise": GuidesAdvertise,
    "GuidesFindSales": GuidesFindSales,
    "GuidesPermit": GuidesPermit,
    "GuidesPricing": GuidesPricing,
    "GuidesSeniors": GuidesSeniors,
    "GuidesTimings": GuidesTimings,
    "Home": Home,
    "Legal": Legal,
    "Messages": Messages,
    "MyYardSales": MyYardSales,
    "Pricing": Pricing,
    "Profile": Profile,
    "SalePage": SalePage,
    "SellerPage": SellerPage,
    "StoopSalesBronx": StoopSalesBronx,
    "StoopSalesBrooklyn": StoopSalesBrooklyn,
    "StoopSalesJerseyCity": StoopSalesJerseyCity,
    "StoopSalesManhattan": StoopSalesManhattan,
    "StoopSalesNYCWeekend": StoopSalesNYCWeekend,
    "StoopSalesQueens": StoopSalesQueens,
    "YardSaleDetails": YardSaleDetails,
    "YardSales": YardSales,
    "YardSalesNearMeWeekend": YardSalesNearMeWeekend,
    "add-yard-sale": addYardSale,
    "guides-advertise-yard-sale": guidesAdvertiseYardSale,
    "guides-best-time-yard-sale": guidesBestTimeYardSale,
    "guides-find-yard-sales": guidesFindYardSales,
    "guides-permit-requirements-nyc": guidesPermitRequirementsNyc,
    "guides-pricing-yard-sale-items": guidesPricingYardSaleItems,
    "guides-seniors-yard-sales": guidesSeniorsYardSales,
    "guides": guides,
    "my-yard-sales": myYardSales,
    "yard-sales": yardSales,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};