import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import FindStoopSalesNearYou from './pages/find-stoop-sales-near-you';
import HowToPriceItemsStoopSale from './pages/how-to-price-items-stoop-sale';
import WhereToPostYardSaleOnline from './pages/where-to-post-yard-sale-online';
import SiteMap from './pages/SiteMap';
import FreeItems from './pages/FreeItems';
import FreeStuffCity from './pages/FreeStuffCity';
import { Navigate } from 'react-router-dom';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="/find-stoop-sales-near-you" element={<LayoutWrapper currentPageName="find-stoop-sales-near-you"><FindStoopSalesNearYou /></LayoutWrapper>} />
      <Route path="/how-to-price-items-stoop-sale" element={<LayoutWrapper currentPageName="how-to-price-items-stoop-sale"><HowToPriceItemsStoopSale /></LayoutWrapper>} />
      <Route path="/where-to-post-yard-sale-online" element={<LayoutWrapper currentPageName="where-to-post-yard-sale-online"><WhereToPostYardSaleOnline /></LayoutWrapper>} />
      <Route path="/site-map" element={<LayoutWrapper currentPageName="site-map"><SiteMap /></LayoutWrapper>} />
      <Route path="/free-items" element={<LayoutWrapper currentPageName="free-items"><FreeItems /></LayoutWrapper>} />
      <Route path="/free-stuff-nyc" element={<LayoutWrapper currentPageName="free-stuff-nyc"><FreeStuffCity /></LayoutWrapper>} />
      <Route path="/free-stuff-brooklyn" element={<LayoutWrapper currentPageName="free-stuff-brooklyn"><FreeStuffCity /></LayoutWrapper>} />
      <Route path="/free-stuff-queens" element={<LayoutWrapper currentPageName="free-stuff-queens"><FreeStuffCity /></LayoutWrapper>} />
      <Route path="/free-stuff-hoboken" element={<LayoutWrapper currentPageName="free-stuff-hoboken"><FreeStuffCity /></LayoutWrapper>} />

      {/* 301 redirects: old PascalCase guide URLs → SEO-friendly slugs */}
      <Route path="/GuidesFindSales" element={<Navigate to="/guides-find-yard-sales" replace />} />
      <Route path="/GuidesPricing" element={<Navigate to="/guides-pricing-yard-sale-items" replace />} />
      <Route path="/GuidesTimings" element={<Navigate to="/guides-best-time-yard-sale" replace />} />
      <Route path="/GuidesPermit" element={<Navigate to="/guides-permit-requirements-nyc" replace />} />
      <Route path="/GuidesAdvertise" element={<Navigate to="/guides-advertise-yard-sale" replace />} />
      <Route path="/GuidesSeniors" element={<Navigate to="/guides-seniors-yard-sales" replace />} />
      {/* Old city page redirects */}
      <Route path="/StoopSalesBrooklyn" element={<Navigate to="/stoop-sales-brooklyn" replace />} />
      <Route path="/StoopSalesQueens" element={<Navigate to="/stoop-sales-queens" replace />} />
      <Route path="/StoopSalesManhattan" element={<Navigate to="/stoop-sales-manhattan" replace />} />
      <Route path="/StoopSalesBronx" element={<Navigate to="/stoop-sales-bronx" replace />} />
      <Route path="/StoopSalesJerseyCity" element={<Navigate to="/stoop-sales-jersey-city" replace />} />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App