import CityLandingPage from '../components/seo/CityLandingPage';

const config = {
  city: 'New York City',
  state: 'NY',
  title: 'NYC Stoop Sales',
  metaTitle: 'Stoop Sales NYC Today (Live Map) | Stooplify',
  metaDescription: 'Discover stoop sales happening across NYC today. Browse live listings in Brooklyn, Queens, Manhattan, and the Bronx. Find hidden gems at amazing prices near you.',
  keywords: 'stoop sales NYC, NYC stoop sale, stoop sale New York, Brooklyn stoop sales, Queens stoop sales, Manhattan stoop sales',
  h1: 'Stoop Sales in NYC — Live Listings',
  intro: 'The ultimate guide to NYC stoop sales. Explore live listings across all five boroughs — from Williamsburg brownstones to Astoria walkups. Find unique items and neighborhood treasures.',
  canonicalUrl: 'https://stooplify.com/stoop-sales-nyc',
  neighborhoods: ['Williamsburg', 'Park Slope', 'Bushwick', 'Bed-Stuy', 'Crown Heights', 'Greenpoint', 'Astoria', 'Jackson Heights', 'Upper West Side', 'Harlem', 'Fordham', 'Riverdale'],
  relatedCities: [
    { label: 'Brooklyn', url: '/stoop-sales-brooklyn' },
    { label: 'Queens', url: '/stoop-sales-queens' },
    { label: 'Manhattan', url: '/stoop-sales-manhattan' },
    { label: 'Bronx', url: '/stoop-sales-bronx' },
    { label: 'Jersey City', url: '/stoop-sales-jersey-city' },
  ],
  relatedGuides: [
    { label: 'How to Advertise Your Stoop Sale', url: '/guides-advertise-yard-sale' },
    { label: 'Best Days & Times', url: '/guides-best-time-yard-sale' },
    { label: 'NYC Permit Requirements', url: '/guides-permit-requirements-nyc' },
    { label: 'How to Price Your Items', url: '/guides-pricing-yard-sale-items' },
  ],
};

export default function StoopSalesNYC() {
  return <CityLandingPage config={config} />;
}