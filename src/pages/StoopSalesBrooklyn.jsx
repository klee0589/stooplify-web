import CityLandingPage from '../components/seo/CityLandingPage';

const config = {
  city: 'Brooklyn',
  state: 'NY',
  title: 'Brooklyn Stoop Sales',
  metaTitle: 'Stoop Sales Brooklyn — Live Listings This Weekend | Stooplify',
  metaDescription: 'Stoop sales in Brooklyn happening this weekend. Williamsburg, Park Slope, Bushwick, Crown Heights & more. Interactive map, real listings, updated daily.',
  keywords: 'stoop sales brooklyn, stoop sale brooklyn, brooklyn stoop sales, williamsburg stoop sale, park slope stoop sale, bushwick stoop sale, crown heights stoop sale',
  h1: 'Brooklyn Stoop Sales — Find Sales Near You This Weekend',
  intro: 'Discover the best stoop sales happening across Brooklyn this weekend. From Williamsburg to Park Slope, Bushwick to Crown Heights — Stooplify shows every live listing in real time, updated daily.',
  neighborhoods: ['Williamsburg', 'Park Slope', 'Bushwick', 'Crown Heights', 'Bed-Stuy', 'Carroll Gardens', 'Cobble Hill', 'DUMBO', 'Bay Ridge', 'Flatbush', 'Greenpoint', 'Sunset Park'],
  canonicalUrl: 'https://stooplify.com/stoop-sales-brooklyn',
  relatedCities: [
    { label: 'Queens Stoop Sales', url: '/stoop-sales-queens' },
    { label: 'Manhattan Stoop Sales', url: '/stoop-sales-manhattan' },
    { label: 'Bronx Stoop Sales', url: '/stoop-sales-bronx' },
    { label: 'Jersey City Stoop Sales', url: '/stoop-sales-jersey-city' },
    { label: 'Brooklyn This Weekend', url: '/brooklyn-stoop-sales-this-weekend' },
  ],
  relatedGuides: [
    { label: 'How to Host a Stoop Sale in NYC', url: '/how-to-host-a-stoop-sale' },
    { label: 'How to Price Yard Sale Items', url: '/guides-pricing-yard-sale-items' },
    { label: 'How to Advertise a Yard Sale', url: '/guides-advertise-yard-sale' },
    { label: 'Best Days & Times for a Sale', url: '/guides-best-time-yard-sale' },
  ],
};

export default function StoopSalesBrooklyn() {
  return <CityLandingPage config={config} />;
}