import Home from './pages/Home';
import YardSales from './pages/YardSales';
import YardSaleDetails from './pages/YardSaleDetails';
import AddYardSale from './pages/AddYardSale';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "YardSales": YardSales,
    "YardSaleDetails": YardSaleDetails,
    "AddYardSale": AddYardSale,
    "Favorites": Favorites,
    "Profile": Profile,
    "Admin": Admin,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};