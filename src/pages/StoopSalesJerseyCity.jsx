import CityLandingPage from '../components/seo/CityLandingPage';

const config = {
  city: 'Jersey City',
  state: 'NJ',
  title: 'Jersey City Stoop Sales',
  metaTitle: 'Jersey City Stoop Sales & Yard Sales Near You | Stooplify',
  metaDescription: 'Find stoop sales and yard sales in Jersey City, NJ. Downtown, Journal Square, The Heights, Greenville & more. Live listings on Stooplify.',
  keywords: 'jersey city stoop sales, jersey city yard sales, jersey city garage sales, downtown jersey city stoop sale, journal square yard sale, the heights jersey city sales',
  h1: 'Jersey City Stoop Sales & Yard Sales Near You',
  intro: 'Browse stoop sales and yard sales happening across Jersey City — from Downtown JC to The Heights and Journal Square.',
  neighborhoods: ['Downtown', 'Journal Square', 'The Heights', 'Greenville', 'Bergen-Lafayette', 'McGinley Square', 'Newport'],
  canonicalUrl: 'https://stooplify.com/stoop-sales-jersey-city',
};

export default function StoopSalesJerseyCity() {
  return <CityLandingPage config={config} />;
}