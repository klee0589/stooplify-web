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
import Favorites from './pages/Favorites';
import Guides from './pages/Guides';
import GuidesAdvertise from './pages/GuidesAdvertise';
import GuidesFindSales from './pages/GuidesFindSales';
import GuidesPermit from './pages/GuidesPermit';
import GuidesPricing from './pages/GuidesPricing';
import GuidesSeniors from './pages/GuidesSeniors';
import GuidesTimings from './pages/GuidesTimings';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Profile from './pages/Profile';
import YardSaleDetails from './pages/YardSaleDetails';
import YardSales from './pages/YardSales';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AddYardSale": AddYardSale,
    "AdminCommunityLocations": AdminCommunityLocations,
    "AdminSupabaseSync": AdminSupabaseSync,
    "ApplyAsShop": ApplyAsShop,
    "Favorites": Favorites,
    "Guides": Guides,
    "GuidesAdvertise": GuidesAdvertise,
    "GuidesFindSales": GuidesFindSales,
    "GuidesPermit": GuidesPermit,
    "GuidesPricing": GuidesPricing,
    "GuidesSeniors": GuidesSeniors,
    "GuidesTimings": GuidesTimings,
    "Home": Home,
    "Pricing": Pricing,
    "Profile": Profile,
    "YardSaleDetails": YardSaleDetails,
    "YardSales": YardSales,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};