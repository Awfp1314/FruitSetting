import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import FruitPromoPage from './pages/FruitPromoPage';
import MarketCalendarPage from './pages/MarketCalendarPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigate = (pageId) => {
    setCurrentPage(pageId);
    window.history.pushState({ page: pageId }, '', `#${pageId}`);
  };

  const handleBack = () => {
    setCurrentPage('home');
    window.history.pushState({ page: 'home' }, '', '#home');
  };

  useEffect(() => {
    const handlePopState = (event) => {
      if (currentPage !== 'home') {
        setCurrentPage('home');
      } else {
        window.history.back();
      }
    };

    window.addEventListener('popstate', handlePopState);

    // 初始化路由
    const hash = window.location.hash.slice(1);
    if (hash === 'fruit-promo' || hash === 'market-calendar') {
      setCurrentPage(hash);
    } else {
      window.history.replaceState({ page: 'home' }, '', '#home');
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentPage]);

  return (
    <>
      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
      {currentPage === 'fruit-promo' && <FruitPromoPage onBack={handleBack} />}
      {currentPage === 'market-calendar' && <MarketCalendarPage onBack={handleBack} />}
    </>
  );
};

export default App;
