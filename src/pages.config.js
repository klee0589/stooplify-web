import AddYardSale from './pages/AddYardSale';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import Profile from './pages/Profile';
import YardSaleDetails from './pages/YardSaleDetails';
import YardSales from './pages/YardSales';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AddYardSale": AddYardSale,
    "Favorites": Favorites,
    "Home": Home,
    "Profile": Profile,
    "YardSaleDetails": YardSaleDetails,
    "YardSales": YardSales,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};