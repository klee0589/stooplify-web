import AddYardSale from './pages/AddYardSale';
import ApplyAsShop from './pages/ApplyAsShop';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Profile from './pages/Profile';
import YardSaleDetails from './pages/YardSaleDetails';
import YardSales from './pages/YardSales';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AddYardSale": AddYardSale,
    "ApplyAsShop": ApplyAsShop,
    "Favorites": Favorites,
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