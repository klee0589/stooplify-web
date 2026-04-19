import CityLandingPage from '../components/seo/CityLandingPage';

const config = {
  city: 'New York City',
  state: 'NY',
  title: 'NYC Garage Sales',
  metaTitle: 'Garage Sales NYC Today (Live Map) | Stooplify',
  metaDescription: 'Find garage sales, stoop sales, and yard sales happening in NYC today. Browse live listings across Brooklyn, Queens, Manhattan, the Bronx, and Staten Island on Stooplify.',
  keywords: 'garage sales NYC, NYC garage sale, garage sales New York City, NYC yard sales, stoop sales NYC, New York garage sales today',
  h1: 'Garage Sales in NYC — Live Map',
  intro: 'Browse hundreds of garage sales, stoop sales, and yard sales happening across all five NYC boroughs. Find furniture, vintage clothing, electronics, antiques, and more.',
  canonicalUrl: 'https://stooplify.com/garage-sales-nyc',
  neighborhoods: ['Williamsburg', 'Park Slope', 'Bushwick', 'Astoria', 'Harlem', 'Bed-Stuy', 'Crown Heights', 'Upper West Side', 'Jackson Heights', 'Greenpoint', 'Riverdale', 'Bronx', 'Staten Island'],
  relatedCities: [
    { label: 'Brooklyn', url: '/stoop-sales-brooklyn' },
    { label: 'Queens', url: '/stoop-sales-queens' },
    { label: 'Manhattan', url: '/stoop-sales-manhattan' },
    { label: 'Bronx', url: '/stoop-sales-bronx' },
    { label: 'Jersey City', url: '/stoop-sales-jersey-city' },
    { label: 'Hoboken', url: '/stoop-sales-jersey-city' },
  ],
  relatedGuides: [
    { label: 'How to Advertise Your Sale', url: '/guides-advertise-yard-sale' },
    { label: 'Best Days & Times to Host', url: '/guides-best-time-yard-sale' },
    { label: 'Permit Requirements in NYC', url: '/guides-permit-requirements-nyc' },
    { label: 'Pricing Your Items', url: '/guides-pricing-yard-sale-items' },
  ],
};

export default function GarageSalesNYC() {
  return <CityLandingPage config={config} />;
}