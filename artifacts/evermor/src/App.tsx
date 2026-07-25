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
        <>
          {/* SVG filter — organic deckled paper edge */}
          <svg
            aria-hidden="true"
            style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
          >
            <defs>
              <filter id="deckle" x="-4%" y="-4%" width="108%" height="108%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.038"
                  numOctaves="4"
                  seed="9"
                  result="noise"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale="2.2"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            </defs>
          </svg>

          {/* Magazine container */}
          <div
            className="relative mx-auto bg-background"
            style={{
              maxWidth: '1060px',
              transform: 'rotate(-0.35deg)',
              transformOrigin: 'center top',
              filter: 'url(#deckle)',
              /* Directional shadow: light from top-right, shadow falls bottom-left */
              boxShadow: [
                '-2px 2px 6px rgba(0,0,0,0.07)',
                '-4px 8px 24px rgba(0,0,0,0.11)',
                '-6px 20px 55px rgba(0,0,0,0.13)',
                '-8px 40px 90px rgba(0,0,0,0.09)',
              ].join(', '),
            }}
          >
            <Router />
          </div>
        </>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
