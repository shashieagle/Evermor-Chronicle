import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import Home from './pages/Home';
import Beginnings from './pages/Beginnings';
import BeginningsIndex from './pages/BeginningsIndex';
import Journal from './pages/Journal';
import JournalPost from './pages/JournalPost';
import AdminJournal from './pages/AdminJournal';
import About from './pages/About';
import Approach from './pages/Approach';
import BeginYourStory from './pages/BeginYourStory';
import Admin from './pages/Admin';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

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
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/beginnings" component={BeginningsIndex} />
        <Route path="/beginnings/:slug" component={Beginnings} />
        <Route path="/journal" component={Journal} />
        <Route path="/journal/:slug" component={JournalPost} />
        <Route path="/admin/journal" component={AdminJournal} />
        <Route path="/about" component={About} />
        <Route path="/approach" component={Approach} />
        <Route path="/begin-your-story" component={BeginYourStory} />
        <Route path="/admin" component={Admin} />
      </Switch>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppButton />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
