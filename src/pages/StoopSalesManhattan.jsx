import CityLandingPage from '../components/seo/CityLandingPage';

const config = {
  city: 'Manhattan',
  state: 'NY',
  title: 'Manhattan Stoop Sales',
  metaTitle: 'Manhattan Stoop Sales — Upper West Side, Harlem, East Village | Stooplify',
  metaDescription: 'Discover stoop sales across Manhattan — Upper West Side, Harlem, East Village, Washington Heights & more. Live listings on Stooplify.',
  keywords: 'manhattan stoop sales, upper west side stoop sale, harlem yard sale, east village stoop sale, washington heights yard sale, manhattan yard sales nyc',
  h1: 'Manhattan Stoop Sales — Find Local Sales Near You',
  intro: 'From the Upper West Side to Harlem, East Village to Washington Heights — browse Manhattan stoop sales and yard sales happening near you.',
  neighborhoods: ['Upper West Side', 'Upper East Side', 'Harlem', 'East Village', 'West Village', 'Washington Heights', 'Inwood', 'Chelsea', 'Hell\'s Kitchen', 'Morningside Heights'],
  canonicalUrl: 'https://stooplify.com/stoop-sales-manhattan',
};

export default function StoopSalesManhattan() {
  return <CityLandingPage config={config} />;
}