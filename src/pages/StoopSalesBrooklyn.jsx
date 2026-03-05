import CityLandingPage from '../components/seo/CityLandingPage';

const config = {
  city: 'Brooklyn',
  state: 'NY',
  title: 'Brooklyn Stoop Sales',
  metaTitle: 'Brooklyn Stoop Sales 2025 — Find Local Stoop Sales Near You | Stooplify',
  metaDescription: 'Find stoop sales in Brooklyn this weekend. Browse Williamsburg, Park Slope, Bushwick, Crown Heights & more. Free listings updated daily on Stooplify.',
  keywords: 'brooklyn stoop sales, stoop sales brooklyn, williamsburg stoop sale, park slope stoop sale, bushwick stoop sale, crown heights stoop sale, bed-stuy stoop sale, brooklyn yard sales',
  h1: 'Brooklyn Stoop Sales — Find Sales Near You',
  intro: 'Discover the best stoop sales happening across Brooklyn this weekend. From Williamsburg to Park Slope, Bushwick to Crown Heights — Stooplify shows you every sale in real time.',
  neighborhoods: ['Williamsburg', 'Park Slope', 'Bushwick', 'Crown Heights', 'Bed-Stuy', 'Carroll Gardens', 'Cobble Hill', 'DUMBO', 'Bay Ridge', 'Flatbush', 'Greenpoint', 'Sunset Park'],
  canonicalUrl: 'https://stooplify.com/stoop-sales-brooklyn',
};

export default function StoopSalesBrooklyn() {
  return <CityLandingPage config={config} />;
}