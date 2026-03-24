import CityLandingPage from '../components/seo/CityLandingPage';

const config = {
  city: 'Bronx',
  state: 'NY',
  title: 'Bronx Stoop Sales',
  metaTitle: 'Bronx Stoop Sales & Yard Sales 2026 — Find Local Sales Near You | Stooplify',
  metaDescription: 'Find stoop sales and yard sales in the Bronx, NY in 2026. Live listings in Fordham, Belmont, Riverdale, Mott Haven & more. Updated daily on Stooplify.',
  keywords: 'bronx stoop sales, bronx yard sales 2026, fordham stoop sale, bronx garage sales, mott haven yard sale, riverdale stoop sale, bronx sales this weekend',
  h1: 'Bronx Stoop Sales & Yard Sales — Find Local Sales This Weekend',
  intro: 'Discover upcoming stoop sales and yard sales across the Bronx — live listings from Fordham to Riverdale, Mott Haven to Co-op City, updated daily on Stooplify.',
  neighborhoods: ['Fordham', 'Belmont', 'Riverdale', 'Mott Haven', 'Hunts Point', 'Morris Heights', 'Tremont', 'Kingsbridge', 'Co-op City', 'Pelham Bay'],
  canonicalUrl: 'https://stooplify.com/stoop-sales-bronx',
  relatedCities: [
    { label: 'Brooklyn Stoop Sales', url: '/stoop-sales-brooklyn' },
    { label: 'Queens Stoop Sales', url: '/stoop-sales-queens' },
    { label: 'Manhattan Stoop Sales', url: '/stoop-sales-manhattan' },
    { label: 'NYC This Weekend', url: '/stoop-sales-nyc-this-weekend' },
    { label: 'Free Stuff NYC', url: '/free-stuff-nyc' },
  ],
  relatedGuides: [
    { label: 'How to Host a Stoop Sale in NYC', url: '/how-to-host-a-stoop-sale' },
    { label: 'Best Days & Times for a Sale', url: '/guides-best-time-yard-sale' },
    { label: 'How to Price Yard Sale Items', url: '/guides-pricing-yard-sale-items' },
    { label: 'Yard Sale Tips for Seniors', url: '/guides-seniors-yard-sales' },
  ],
};

export default function StoopSalesBronx() {
  return <CityLandingPage config={config} />;
}