import CityLandingPage from '../components/seo/CityLandingPage';

const config = {
  city: 'Queens',
  state: 'NY',
  title: 'Queens Stoop Sales',
  metaTitle: 'Queens Stoop Sales & Yard Sales — Find Local Sales Near You | Stooplify',
  metaDescription: 'Find stoop sales and yard sales in Queens, NY. Astoria, Jackson Heights, Long Island City & more. Updated daily on Stooplify.',
  keywords: 'queens stoop sales, yard sales queens ny, astoria stoop sale, jackson heights yard sale, long island city stoop sale, flushing yard sales, queens yard sales this weekend',
  h1: 'Queens Stoop Sales & Yard Sales Near You',
  intro: 'Browse upcoming stoop sales and yard sales across Queens — from Astoria to Jackson Heights, Flushing to Long Island City.',
  neighborhoods: ['Astoria', 'Jackson Heights', 'Long Island City', 'Flushing', 'Forest Hills', 'Jamaica', 'Bayside', 'Sunnyside', 'Woodside', 'Richmond Hill'],
  canonicalUrl: 'https://stooplify.com/stoop-sales-queens',
};

export default function StoopSalesQueens() {
  return <CityLandingPage config={config} />;
}