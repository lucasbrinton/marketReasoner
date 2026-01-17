import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home } from 'lucide-react'
import { DashboardPage } from './pages/DashboardPage'
import { AnalyzePage } from './pages/AnalyzePage'
import { NewsPage } from './pages/NewsPage'
import { RiskPage } from './pages/RiskPage'
import { StrategyPage } from './pages/StrategyPage'
import { ScreenerPage } from './pages/ScreenerPage'
import { DailyPage } from './pages/DailyPage'
import { HistoryPage } from './pages/HistoryPage'
import { ToastProvider } from './components/ToastProvider'
import { ErrorBoundary } from './components/ErrorBoundary'
import { DarkModeToggle } from './components/DarkModeToggle'
import { useOnlineStatus } from './hooks/useOnlineStatus'
import { getDarkMode, setDarkMode } from './utils/storage'

type ActivePage = 'home' | 'stocks' | 'news' | 'risk' | 'strategy' | 'screener' | 'daily' | 'history';

function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [isDark, setIsDark] = useState(false);
  
  // Monitor online status
  useOnlineStatus();

  // Initialize dark mode from storage/system preference
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

  const handleNavigate = (page: string) => {
    setActivePage(page as ActivePage);
  };

  const navItems: { key: ActivePage; label: string }[] = [
    { key: 'stocks', label: 'Stocks' },
    { key: 'news', label: 'News' },
    { key: 'risk', label: 'Risk' },
    { key: 'strategy', label: 'Strategy' },
    { key: 'screener', label: 'Screener' },
    { key: 'daily', label: 'Daily' },
    { key: 'history', label: 'History' }
  ];

  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="min-h-screen bg-background transition-colors duration-200">
          {/* Header */}
          <header className="bg-surface border-b border-border sticky top-0 z-40">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
              <div className="flex items-center justify-between gap-4">
                {/* Logo */}
                <button 
                  onClick={() => setActivePage('home')}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">M</span>
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-xl font-semibold text-text-primary">MarketMind</h1>
                    <p className="text-xs text-text-muted">AI-Powered Market Analysis</p>
                  </div>
                </button>
                
                {/* Navigation Tabs */}
                <nav className="flex items-center gap-1 bg-background rounded-lg p-1 overflow-x-auto">
                  <button
                    onClick={() => setActivePage('home')}
                    className={`p-2 rounded-md transition-colors ${
                      activePage === 'home'
                        ? 'bg-accent text-white'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                    }`}
                    title="Home"
                  >
                    <Home className="w-4 h-4" />
                  </button>
                  {navItems.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setActivePage(key)}
                      className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                        activePage === key
                          ? 'bg-accent text-white'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </nav>

                {/* Dark Mode Toggle */}
                <DarkModeToggle isDark={isDark} onToggle={toggleDarkMode} />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                {activePage === 'home' && <DashboardPage onNavigate={handleNavigate} />}
                {activePage === 'stocks' && <AnalyzePage />}
                {activePage === 'news' && <NewsPage />}
                {activePage === 'risk' && <RiskPage />}
                {activePage === 'strategy' && <StrategyPage />}
                {activePage === 'screener' && <ScreenerPage />}
                {activePage === 'daily' && <DailyPage />}
                {activePage === 'history' && <HistoryPage />}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Footer */}
          <footer className="border-t border-border mt-auto">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
              <p className="text-xs text-text-muted text-center">
                ⚠️ For educational and research purposes only. Not investment advice. No buy/sell recommendations.
              </p>
            </div>
          </footer>
        </div>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
