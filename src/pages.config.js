import Home from './pages/Home';
import YardSales from './pages/YardSales';
import YardSaleDetails from './pages/YardSaleDetails';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "YardSales": YardSales,
    "YardSaleDetails": YardSaleDetails,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};