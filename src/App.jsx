import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import FruitPromoPage from './pages/FruitPromoPage';
import MarketCalendarPage from './pages/MarketCalendarPage';
import BottomNav from './components/BottomNav';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigate = (pageId) => {
    setCurrentPage(pageId);
    window.history.pushState({ page: pageId }, '', `#${pageId}`);
  };

  const handleBack = () => {
    // 从工具页面返回到首页
    setCurrentPage('home');
    window.history.pushState({ page: 'home' }, '', '#home');
  };

  useEffect(() => {
    const handlePopState = (event) => {
      // 如果在工具详情页，返回到首页
      if (currentPage === 'fruit-promo' || currentPage === 'market-calendar') {
        setCurrentPage('home');
      }
      // 如果在主要页面（home/profile），允许退出
      else {
        window.history.back();
      }
    };

    window.addEventListener('popstate', handlePopState);

    // 初始化路由
    const hash = window.location.hash.slice(1);
    if (['home', 'profile', 'fruit-promo', 'market-calendar'].includes(hash)) {
      setCurrentPage(hash);
    } else {
      window.history.replaceState({ page: 'home' }, '', '#home');
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentPage]);

  // 判断是否显示底部导航
  const showBottomNav = ['home', 'profile'].includes(currentPage);

  return (
    <>
      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
      {currentPage === 'profile' && <ProfilePage />}
      {currentPage === 'fruit-promo' && <FruitPromoPage onBack={handleBack} />}
      {currentPage === 'market-calendar' && <MarketCalendarPage onBack={handleBack} />}

      {showBottomNav && <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />}
    </>
  );
};

export default App;
