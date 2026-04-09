import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Link } from 'react-router-dom';
import { Home, Loader2 } from 'lucide-react';
import { ToastProvider } from './components/ToastProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DarkModeToggle } from './components/DarkModeToggle';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { getDarkMode, setDarkMode } from './utils/storage';

const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const AnalyzePage = lazy(() => import('./pages/AnalyzePage').then(m => ({ default: m.AnalyzePage })));
const NewsPage = lazy(() => import('./pages/NewsPage').then(m => ({ default: m.NewsPage })));
const RiskPage = lazy(() => import('./pages/RiskPage').then(m => ({ default: m.RiskPage })));
const StrategyPage = lazy(() => import('./pages/StrategyPage').then(m => ({ default: m.StrategyPage })));
const ScreenerPage = lazy(() => import('./pages/ScreenerPage').then(m => ({ default: m.ScreenerPage })));
const DailyPage = lazy(() => import('./pages/DailyPage').then(m => ({ default: m.DailyPage })));
const HistoryPage = lazy(() => import('./pages/HistoryPage').then(m => ({ default: m.HistoryPage })));

const navItems = [
  { path: '/stocks', label: 'Stocks' },
  { path: '/news', label: 'News' },
  { path: '/risk', label: 'Risk' },
  { path: '/strategy', label: 'Strategy' },
  { path: '/screener', label: 'Screener' },
  { path: '/daily', label: 'Daily' },
  { path: '/history', label: 'History' },
] as const;

function PageFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-accent animate-spin" />
    </div>
  );
}

function Layout() {
  const [isDark, setIsDark] = useState(false);
  useOnlineStatus();

  useEffect(() => {
    const darkPref = getDarkMode();
    setIsDark(darkPref);
    if (darkPref) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    setDarkMode(newValue);
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-200 flex flex-col">
      <header className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-text-primary">MarketMind</h1>
                <p className="text-xs text-text-muted">AI-Powered Market Analysis</p>
              </div>
            </Link>

            <nav className="flex items-center gap-1 bg-background rounded-lg p-1 overflow-x-auto" role="navigation" aria-label="Main navigation">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `p-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-accent text-white'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                  }`
                }
                aria-label="Home"
              >
                <Home className="w-4 h-4" />
              </NavLink>
              {navItems.map(({ path, label }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-accent text-white'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            <DarkModeToggle isDark={isDark} onToggle={toggleDarkMode} />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex-1">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/stocks" element={<AnalyzePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/risk" element={<RiskPage />} />
            <Route path="/strategy" element={<StrategyPage />} />
            <Route path="/screener" element={<ScreenerPage />} />
            <Route path="/daily" element={<DailyPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </Suspense>
      </main>

      <footer className="border-t border-border mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <p className="text-xs text-text-muted text-center">
            For educational and research purposes only. Not investment advice. No buy/sell recommendations.
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
