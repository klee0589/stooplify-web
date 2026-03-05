import WeekendSalesPage from '../components/seo/WeekendSalesPage';

const config = {
  title: 'Yard Sales Near Me This Weekend',
  metaTitle: 'Yard Sales Near Me This Weekend — Find Local Sales | Stooplify',
  metaDescription: 'Find yard sales, garage sales, and stoop sales near you this weekend. Real-time listings from local sellers in your neighborhood on Stooplify.',
  keywords: 'yard sales near me this weekend, garage sales near me this weekend, yard sales this saturday, local yard sales today, stoop sales near me, estate sales near me this weekend',
  h1: 'Yard Sales Near Me This Weekend — {date}',
  intro: 'Discover yard sales, garage sales, and stoop sales happening near you this weekend. Real listings from real neighbors — updated live.',
  cityFilter: null, // Show all sales
  neighborhoodFilter: null,
  canonicalUrl: 'https://stooplify.com/yard-sales-near-me-this-weekend',
};

export default function YardSalesNearMeWeekend() {
  return <WeekendSalesPage config={config} />;
}