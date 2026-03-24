import CityLandingPage from '../components/seo/CityLandingPage';

const config = {
  city: 'Manhattan',
  state: 'NY',
  title: 'Manhattan Stoop Sales',
  metaTitle: 'Manhattan Stoop Sales 2026 — Upper West Side, Harlem, East Village | Stooplify',
  metaDescription: 'Discover stoop sales across Manhattan in 2026 — Upper West Side, Harlem, East Village, Washington Heights & more. Live listings updated daily on Stooplify.',
  keywords: 'manhattan stoop sales, upper west side stoop sale, harlem yard sale, east village stoop sale, washington heights yard sale, manhattan yard sales nyc 2026',
  h1: 'Manhattan Stoop Sales — Find Local Sales Near You This Weekend',
  intro: 'From the Upper West Side to Harlem, East Village to Washington Heights — browse live Manhattan stoop sales and yard sales happening near you, updated in real time on Stooplify.',
  neighborhoods: ['Upper West Side', 'Upper East Side', 'Harlem', 'East Village', 'West Village', 'Washington Heights', 'Inwood', 'Chelsea', "Hell's Kitchen", 'Morningside Heights'],
  canonicalUrl: 'https://stooplify.com/stoop-sales-manhattan',
  relatedCities: [
    { label: 'Brooklyn Stoop Sales', url: '/stoop-sales-brooklyn' },
    { label: 'Queens Stoop Sales', url: '/stoop-sales-queens' },
    { label: 'Bronx Stoop Sales', url: '/stoop-sales-bronx' },
    { label: 'NYC This Weekend', url: '/stoop-sales-nyc-this-weekend' },
    { label: 'Free Stuff NYC', url: '/free-stuff-nyc' },
  ],
  relatedGuides: [
    { label: 'Do You Need a Permit for a Stoop Sale in NYC?', url: '/guides-permit-requirements-nyc' },
    { label: 'How to Host a Stoop Sale in NYC', url: '/how-to-host-a-stoop-sale' },
    { label: 'How to Advertise a Yard Sale', url: '/guides-advertise-yard-sale' },
    { label: 'What Is a Stoop Sale?', url: '/what-is-a-stoop-sale' },
  ],
};

export default function StoopSalesManhattan() {
  return <CityLandingPage config={config} />;
}