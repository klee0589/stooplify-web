import CityLandingPage from '../components/seo/CityLandingPage';

const config = {
  city: 'San Francisco',
  state: 'CA',
  title: 'San Francisco Garage Sales',
  metaTitle: 'Garage Sales in San Francisco — Find Local Yard Sales Near You | Stooplify',
  metaDescription: 'Find garage sales and yard sales in San Francisco, CA. Mission District, Castro, Noe Valley, Haight-Ashbury & more. Live listings on Stooplify.',
  keywords: 'garage sales san francisco, yard sales sf, san francisco garage sales this weekend, mission district yard sale, castro garage sale, noe valley yard sale, sf yard sales near me',
  h1: 'San Francisco Garage Sales & Yard Sales Near You',
  intro: 'Browse garage sales and yard sales happening across San Francisco — from the Mission to Noe Valley, Castro to Outer Sunset.',
  neighborhoods: ['Mission District', 'Castro', 'Noe Valley', 'Haight-Ashbury', 'Cole Valley', 'Outer Sunset', 'Inner Richmond', 'Bernal Heights', 'Potrero Hill', 'Glen Park', 'Excelsior'],
  canonicalUrl: 'https://stooplify.com/garage-sales-san-francisco',
};

export default function GarageSalesSanFrancisco() {
  return <CityLandingPage config={config} />;
}