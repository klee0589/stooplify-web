import Home from './pages/Home';
import YardSales from './pages/YardSales';
import YardSaleDetails from './pages/YardSaleDetails';
import AddYardSale from './pages/AddYardSale';
import Favorites from './pages/Favorites';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "YardSales": YardSales,
    "YardSaleDetails": YardSaleDetails,
    "AddYardSale": AddYardSale,
    "Favorites": Favorites,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};