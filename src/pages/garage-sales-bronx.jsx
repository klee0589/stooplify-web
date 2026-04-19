import CityLandingPage from '../components/seo/CityLandingPage';

const config = {
  city: 'Bronx',
  state: 'NY',
  title: 'Bronx Garage Sales',
  metaTitle: 'Garage Sales in the Bronx Today (Live Map) | Stooplify',
  metaDescription: 'Browse garage sales and yard sales happening in the Bronx today. Live listings from Riverdale, Fordham, Pelham Bay, and more. Find great deals near you.',
  keywords: 'garage sales bronx, bronx garage sale, bronx yard sale, riverdale garage sale, fordham stoop sale, bronx NYC yard sales',
  h1: 'Garage Sales in the Bronx — Live Listings',
  intro: 'The Bronx has a rich tradition of neighborhood yard sales and stoop sales. From Riverdale estates to Fordham stoops, you\'ll find furniture, clothing, collectibles, and more at unbeatable prices.',
  canonicalUrl: 'https://stooplify.com/garage-sales-bronx',
  neighborhoods: ['Riverdale', 'Fordham', 'Pelham Bay', 'Mott Haven', 'Tremont', 'Norwood', 'Kingsbridge', 'Soundview', 'Throgs Neck', 'Co-op City', 'Wakefield', 'Woodlawn'],
  relatedCities: [
    { label: 'Brooklyn', url: '/stoop-sales-brooklyn' },
    { label: 'Queens', url: '/stoop-sales-queens' },
    { label: 'Manhattan', url: '/stoop-sales-manhattan' },
    { label: 'All NYC', url: '/garage-sales-nyc' },
  ],
  relatedGuides: [
    { label: 'How to Advertise Your Sale', url: '/guides-advertise-yard-sale' },
    { label: 'Best Days to Host', url: '/guides-best-time-yard-sale' },
    { label: 'NYC Permit Requirements', url: '/guides-permit-requirements-nyc' },
    { label: 'How to Price Your Items', url: '/guides-pricing-yard-sale-items' },
  ],
};

export default function GarageSalesBronx() {
  return <CityLandingPage config={config} />;
}