import WeekendSalesPage from '../components/seo/WeekendSalesPage';

const config = {
  title: 'NYC Stoop Sales This Weekend',
  metaTitle: 'NYC Stoop Sales This Weekend — Live Listings | Stooplify',
  metaDescription: 'Find stoop sales, yard sales, and garage sales happening in NYC this weekend. Live listings across Brooklyn, Queens, Manhattan & the Bronx.',
  keywords: 'stoop sales nyc this weekend, nyc yard sales this weekend, brooklyn stoop sales weekend, nyc garage sales saturday, stoop sale near me this weekend',
  h1: 'NYC Stoop Sales This Weekend — {date}',
  intro: 'Browse every stoop sale, yard sale, and garage sale happening across New York City this weekend. Listings updated live.',
  cityFilter: ['brooklyn', 'queens', 'manhattan', 'bronx', 'staten island', 'new york', 'ny'],
  canonicalUrl: 'https://stooplify.com/stoop-sales-nyc-this-weekend',
};

export default function StoopSalesNYCWeekend() {
  return <WeekendSalesPage config={config} />;
}