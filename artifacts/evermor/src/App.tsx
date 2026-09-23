import { lazy, Suspense, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import Home from './pages/Home';
import Footer from './components/Footer';
import DraftBanner from './components/DraftBanner';

const Beginnings = lazy(() => import('./pages/Beginnings'));
const BeginningsIndex = lazy(() => import('./pages/BeginningsIndex'));
const Journal = lazy(() => import('./pages/Journal'));
const JournalPost = lazy(() => import('./pages/JournalPost'));
const AdminJournal = lazy(() => import('./pages/AdminJournal'));
const About = lazy(() => import('./pages/About'));
const Approach = lazy(() => import('./pages/Approach'));
const BeginYourStory = lazy(() => import('./pages/BeginYourStory'));
const StoryDNA = lazy(() => import('./pages/StoryDNA'));
const Admin = lazy(() => import('./pages/Admin'));

const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-screen bg-[#EFEFED]" aria-label="Loading page" />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/beginnings" component={BeginningsIndex} />
          <Route path="/beginnings/:slug" component={Beginnings} />
          <Route path="/journal" component={Journal} />
          <Route path="/journal/:slug" component={JournalPost} />
          <Route path="/admin/journal" component={AdminJournal} />
          <Route path="/about" component={About} />
          <Route path="/approach" component={Approach} />
          <Route path="/story-dna" component={StoryDNA} />
          <Route path="/begin-your-story" component={BeginYourStory} />
          <Route path="/admin" component={Admin} />
        </Switch>
      </Suspense>
      {!isAdmin && <Footer />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
      <DraftBanner />
    </QueryClientProvider>
  );
}

export default App;
