import CityLandingPage from '../components/seo/CityLandingPage';

const config = {
  city: 'Queens',
  state: 'NY',
  title: 'Queens Stoop Sales',
  metaTitle: 'Queens Stoop Sales & Yard Sales 2026 — Live Listings Near You | Stooplify',
  metaDescription: 'Find stoop sales and yard sales in Queens, NY this weekend. Astoria, Jackson Heights, Long Island City, Flushing & more. Live listings updated daily on Stooplify.',
  keywords: 'queens stoop sales, yard sales queens ny, astoria stoop sale, jackson heights yard sale, long island city stoop sale, flushing yard sales, queens yard sales this weekend 2026',
  h1: 'Queens Stoop Sales & Yard Sales — Find Local Sales This Weekend',
  intro: 'Browse upcoming stoop sales and yard sales across Queens — from Astoria to Jackson Heights, Flushing to Long Island City. Every sale listed on Stooplify with real-time updates.',
  neighborhoods: ['Astoria', 'Jackson Heights', 'Long Island City', 'Flushing', 'Forest Hills', 'Jamaica', 'Bayside', 'Sunnyside', 'Woodside', 'Richmond Hill'],
  canonicalUrl: 'https://stooplify.com/stoop-sales-queens',
  relatedCities: [
    { label: 'Brooklyn Stoop Sales', url: '/stoop-sales-brooklyn' },
    { label: 'Manhattan Stoop Sales', url: '/stoop-sales-manhattan' },
    { label: 'Bronx Stoop Sales', url: '/stoop-sales-bronx' },
    { label: 'NYC This Weekend', url: '/stoop-sales-nyc-this-weekend' },
    { label: 'Free Stuff Queens', url: '/free-stuff-queens' },
  ],
  relatedGuides: [
    { label: 'How to Host a Stoop Sale in NYC', url: '/how-to-host-a-stoop-sale' },
    { label: 'How to Price Yard Sale Items', url: '/guides-pricing-yard-sale-items' },
    { label: 'Where to Find Yard Sales Near You', url: '/guides-find-yard-sales' },
    { label: 'Best Days & Times for a Sale', url: '/guides-best-time-yard-sale' },
  ],
};

export default function StoopSalesQueens() {
  return <CityLandingPage config={config} />;
}