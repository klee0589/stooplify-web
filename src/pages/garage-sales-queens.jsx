import CityLandingPage from '../components/seo/CityLandingPage';

const config = {
  city: 'Queens',
  state: 'NY',
  title: 'Queens Garage Sales',
  metaTitle: 'Garage Sales in Queens Today (Live Map) | Stooplify',
  metaDescription: 'Find garage sales and yard sales happening in Queens today. Live listings from Astoria, Jackson Heights, Flushing, Forest Hills, Jamaica and more.',
  keywords: 'garage sales queens, queens garage sale, astoria yard sale, jackson heights stoop sale, flushing garage sale, queens NYC yard sales',
  h1: 'Garage Sales in Queens — Live Listings',
  intro: 'Queens\' diverse communities bring an incredible variety to local sales — from Astoria brownstones to Jackson Heights apartments. Browse live yard sale and stoop sale listings across the borough.',
  canonicalUrl: 'https://stooplify.com/garage-sales-queens',
  neighborhoods: ['Astoria', 'Jackson Heights', 'Flushing', 'Jamaica', 'Forest Hills', 'Rego Park', 'Ridgewood', 'Elmhurst', 'Corona', 'Sunnyside', 'Long Island City', 'Woodside', 'Bayside', 'Howard Beach'],
  relatedCities: [
    { label: 'Brooklyn', url: '/stoop-sales-brooklyn' },
    { label: 'Manhattan', url: '/stoop-sales-manhattan' },
    { label: 'Bronx', url: '/stoop-sales-bronx' },
    { label: 'All NYC', url: '/garage-sales-nyc' },
  ],
  relatedGuides: [
    { label: 'Advertise Your Queens Sale', url: '/guides-advertise-yard-sale' },
    { label: 'Best Days to Host', url: '/guides-best-time-yard-sale' },
    { label: 'NYC Permit Requirements', url: '/guides-permit-requirements-nyc' },
    { label: 'How to Price Your Items', url: '/guides-pricing-yard-sale-items' },
  ],
};

export default function GarageSalesQueens() {
  return <CityLandingPage config={config} />;
}