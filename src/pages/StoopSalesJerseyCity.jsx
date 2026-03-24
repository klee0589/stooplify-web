import CityLandingPage from '../components/seo/CityLandingPage';

const config = {
  city: 'Jersey City',
  state: 'NJ',
  title: 'Jersey City Stoop Sales',
  metaTitle: 'Jersey City Stoop Sales & Yard Sales 2026 — Live Listings Near You | Stooplify',
  metaDescription: 'Find stoop sales and yard sales in Jersey City, NJ in 2026. Live listings in Downtown JC, Journal Square, The Heights, Greenville & more on Stooplify.',
  keywords: 'jersey city stoop sales, jersey city yard sales 2026, jersey city garage sales, downtown jersey city stoop sale, journal square yard sale, the heights jersey city sales, hoboken stoop sales',
  h1: 'Jersey City Stoop Sales & Yard Sales — Find Local Sales This Weekend',
  intro: 'Browse stoop sales and yard sales happening across Jersey City — from Downtown JC to The Heights and Journal Square. Live listings updated daily on Stooplify.',
  neighborhoods: ['Downtown', 'Journal Square', 'The Heights', 'Greenville', 'Bergen-Lafayette', 'McGinley Square', 'Newport'],
  canonicalUrl: 'https://stooplify.com/stoop-sales-jersey-city',
  relatedCities: [
    { label: 'Brooklyn Stoop Sales', url: '/stoop-sales-brooklyn' },
    { label: 'Manhattan Stoop Sales', url: '/stoop-sales-manhattan' },
    { label: 'Free Stuff Hoboken', url: '/free-stuff-hoboken' },
    { label: 'NYC This Weekend', url: '/stoop-sales-nyc-this-weekend' },
    { label: 'Free Stuff NYC', url: '/free-stuff-nyc' },
  ],
  relatedGuides: [
    { label: 'How to Host a Stoop Sale', url: '/how-to-host-a-stoop-sale' },
    { label: 'How to Price Yard Sale Items', url: '/guides-pricing-yard-sale-items' },
    { label: 'How to Advertise a Yard Sale', url: '/guides-advertise-yard-sale' },
    { label: 'Selling vs. Giving Away Items', url: '/guides-selling-vs-giving' },
  ],
};

export default function StoopSalesJerseyCity() {
  return <CityLandingPage config={config} />;
}