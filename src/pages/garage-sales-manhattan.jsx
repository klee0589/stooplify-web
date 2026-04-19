import CityLandingPage from '../components/seo/CityLandingPage';

const config = {
  city: 'Manhattan',
  state: 'NY',
  title: 'Manhattan Garage Sales',
  metaTitle: 'Garage Sales in Manhattan Today (Live Map) | Stooplify',
  metaDescription: 'Discover stoop sales and garage sales happening in Manhattan today. Find listings from Upper West Side, Harlem, Washington Heights, and more. Browse the live map.',
  keywords: 'garage sales manhattan, manhattan garage sale, stoop sale manhattan, upper west side yard sale, harlem stoop sale, NYC apartment sale',
  h1: 'Garage Sales in Manhattan — Live Map',
  intro: 'Manhattan apartment cleanouts and stoop sales offer incredible finds — quality furniture, books, art, and more from some of the most interesting homes in the city. Discover live listings near you.',
  canonicalUrl: 'https://stooplify.com/garage-sales-manhattan',
  neighborhoods: ['Upper West Side', 'Upper East Side', 'Harlem', 'Washington Heights', 'Inwood', 'Hell\'s Kitchen', 'Chelsea', 'Greenwich Village', 'East Village', 'Lower East Side', 'SoHo', 'Tribeca', 'Midtown'],
  relatedCities: [
    { label: 'Brooklyn', url: '/stoop-sales-brooklyn' },
    { label: 'Queens', url: '/stoop-sales-queens' },
    { label: 'Bronx', url: '/stoop-sales-bronx' },
    { label: 'All NYC', url: '/garage-sales-nyc' },
  ],
  relatedGuides: [
    { label: 'How to Advertise Your Sale', url: '/guides-advertise-yard-sale' },
    { label: 'NYC Permit Requirements', url: '/guides-permit-requirements-nyc' },
    { label: 'Best Days to Host', url: '/guides-best-time-yard-sale' },
    { label: 'How to Price Items', url: '/guides-pricing-yard-sale-items' },
  ],
};

export default function GarageSalesManhattan() {
  return <CityLandingPage config={config} />;
}