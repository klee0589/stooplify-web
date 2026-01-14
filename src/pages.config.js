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
import AddYardSale from './pages/AddYardSale';
import __Layout from './Layout.jsx';


export const PAGES = {
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
    "AddYardSale": AddYardSale,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};