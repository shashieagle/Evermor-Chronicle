import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import Home from './pages/Home';
import Beginnings from './pages/Beginnings';
import BeginningsIndex from './pages/BeginningsIndex';
import About from './pages/About';
import BeginYourStory from './pages/BeginYourStory';
import Admin from './pages/Admin';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/beginnings" component={BeginningsIndex} />
      <Route path="/beginnings/:slug" component={Beginnings} />
      <Route path="/about" component={About} />
      <Route path="/begin-your-story" component={BeginYourStory} />
      <Route path="/admin" component={Admin} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <div
          className="relative mx-auto bg-background overflow-hidden"
          style={{
            maxWidth: '1100px',
            boxShadow: [
              '0 0 0 0.5px rgba(245,225,190,0.07)',   /* hairline warm edge */
              '0 2px 10px rgba(0,0,0,0.22)',           /* tight contact shadow */
              '0 18px 55px rgba(0,0,0,0.48)',          /* mid lift */
              '0 55px 130px rgba(0,0,0,0.36)',         /* broad ambient */
            ].join(', '),
          }}
        >
          <Router />
        </div>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
