import CityLandingPage from '../components/seo/CityLandingPage';

const config = {
  city: 'Los Angeles',
  state: 'CA',
  title: 'Los Angeles Garage Sales',
  metaTitle: 'Garage Sales in Los Angeles — Find Local Yard Sales Near You | Stooplify',
  metaDescription: 'Find garage sales, yard sales, and estate sales in Los Angeles, CA. Silver Lake, Echo Park, Pasadena, Santa Monica & more. Live listings on Stooplify.',
  keywords: 'garage sales los angeles, yard sales LA, los angeles garage sales this weekend, silver lake yard sale, echo park garage sale, pasadena estate sale, la yard sales near me',
  h1: 'Los Angeles Garage Sales & Yard Sales Near You',
  intro: 'Discover garage sales, yard sales, and estate sales across Los Angeles — from Silver Lake to Santa Monica, Pasadena to Culver City.',
  neighborhoods: ['Silver Lake', 'Echo Park', 'Los Feliz', 'Pasadena', 'Santa Monica', 'Culver City', 'West Hollywood', 'Koreatown', 'Atwater Village', 'Eagle Rock', 'Highland Park'],
  canonicalUrl: 'https://stooplify.com/garage-sales-los-angeles',
};

export default function GarageSalesLosAngeles() {
  return <CityLandingPage config={config} />;
}