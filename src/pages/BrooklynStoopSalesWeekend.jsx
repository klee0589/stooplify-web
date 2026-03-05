import WeekendSalesPage from '../components/seo/WeekendSalesPage';

const config = {
  title: 'Brooklyn Stoop Sales This Weekend',
  metaTitle: 'Brooklyn Stoop Sales This Weekend — Live Listings | Stooplify',
  metaDescription: 'Stoop sales happening in Brooklyn this weekend. Williamsburg, Park Slope, Bushwick, Crown Heights & more. Updated live on Stooplify.',
  keywords: 'brooklyn stoop sales this weekend, brooklyn yard sales this weekend, brooklyn garage sales saturday, williamsburg stoop sale weekend, park slope stoop sale, brooklyn stoop sales near me',
  h1: 'Brooklyn Stoop Sales This Weekend — {date}',
  intro: 'Live listings of every stoop sale happening across Brooklyn this weekend. Williamsburg, Park Slope, Bushwick, Crown Heights, and more.',
  cityFilter: ['brooklyn', 'new york', 'ny'],
  neighborhoodFilter: ['williamsburg', 'park slope', 'bushwick', 'crown heights', 'bed-stuy', 'bedford-stuyvesant', 'carroll gardens', 'cobble hill', 'greenpoint', 'flatbush', 'sunset park', 'bay ridge', 'red hook', 'dumbo', 'fort greene', 'clinton hill'],
  canonicalUrl: 'https://stooplify.com/brooklyn-stoop-sales-this-weekend',
};

export default function BrooklynStoopSalesWeekend() {
  return <WeekendSalesPage config={config} />;
}