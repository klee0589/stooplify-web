import CityLandingPage from '../components/seo/CityLandingPage';

const config = {
  city: 'Brooklyn',
  state: 'NY',
  title: 'Brooklyn Garage Sales',
  metaTitle: 'Garage Sales in Brooklyn Today (Live Map) | Stooplify',
  metaDescription: 'Find garage sales and stoop sales in Brooklyn today. Live listings from Williamsburg, Park Slope, Bushwick, Bed-Stuy, Crown Heights and more. Browse the map now.',
  keywords: 'garage sales brooklyn, brooklyn garage sale, garage sales in brooklyn, brooklyn stoop sale, williamsburg garage sale, park slope yard sale, bushwick stoop sale',
  h1: 'Garage Sales in Brooklyn — Today\'s Live Listings',
  intro: 'Brooklyn\'s vibrant stoop sale scene has something for everyone — vintage finds in Williamsburg, furniture in Park Slope, antiques in Bed-Stuy. Browse live listings and plan your route.',
  canonicalUrl: 'https://stooplify.com/garage-sales-brooklyn',
  neighborhoods: ['Williamsburg', 'Bushwick', 'Park Slope', 'Bed-Stuy', 'Crown Heights', 'Greenpoint', 'Red Hook', 'Sunset Park', 'Borough Park', 'Flatbush', 'Bay Ridge', 'Cobble Hill', 'Carroll Gardens', 'DUMBO', 'Fort Greene', 'Prospect Heights'],
  relatedCities: [
    { label: 'Queens', url: '/stoop-sales-queens' },
    { label: 'Manhattan', url: '/stoop-sales-manhattan' },
    { label: 'Bronx', url: '/stoop-sales-bronx' },
    { label: 'All NYC', url: '/garage-sales-nyc' },
    { label: 'Jersey City', url: '/stoop-sales-jersey-city' },
  ],
  relatedGuides: [
    { label: 'Advertise Your Brooklyn Sale', url: '/guides-advertise-yard-sale' },
    { label: 'Best Weekends for Sales', url: '/guides-best-time-yard-sale' },
    { label: 'NYC Permit Info', url: '/guides-permit-requirements-nyc' },
    { label: 'Pricing Your Items', url: '/guides-pricing-yard-sale-items' },
  ],
};

export default function GarageSalesBrooklyn() {
  return <CityLandingPage config={config} />;
}