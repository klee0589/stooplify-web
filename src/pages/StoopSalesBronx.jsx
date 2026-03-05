import CityLandingPage from '../components/seo/CityLandingPage';

const config = {
  city: 'Bronx',
  state: 'NY',
  title: 'Bronx Stoop Sales',
  metaTitle: 'Bronx Stoop Sales & Yard Sales — Find Local Sales Near You | Stooplify',
  metaDescription: 'Find stoop sales and yard sales in the Bronx, NY. Fordham, Belmont, Riverdale, Mott Haven & more. Updated daily on Stooplify.',
  keywords: 'bronx stoop sales, bronx yard sales, fordham stoop sale, bronx garage sales, mott haven yard sale, riverdale stoop sale, bronx sales this weekend',
  h1: 'Bronx Stoop Sales & Yard Sales Near You',
  intro: 'Discover upcoming stoop sales and yard sales across the Bronx — browse live listings from Fordham to Riverdale.',
  neighborhoods: ['Fordham', 'Belmont', 'Riverdale', 'Mott Haven', 'Hunts Point', 'Morris Heights', 'Tremont', 'Kingsbridge', 'Co-op City', 'Pelham Bay'],
  canonicalUrl: 'https://stooplify.com/stoop-sales-bronx',
};

export default function StoopSalesBronx() {
  return <CityLandingPage config={config} />;
}