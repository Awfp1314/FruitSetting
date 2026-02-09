import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import ToolsPage from './pages/ToolsPage';
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
    // 从工具页面返回到工具列表
    setCurrentPage('tools');
    window.history.pushState({ page: 'tools' }, '', '#tools');
  };

  useEffect(() => {
    const handlePopState = (event) => {
      // 如果在工具详情页，返回到工具列表
      if (currentPage === 'fruit-promo' || currentPage === 'market-calendar') {
        setCurrentPage('tools');
      }
      // 如果在主要页面（home/tools/profile），允许退出
      else {
        window.history.back();
      }
    };

    window.addEventListener('popstate', handlePopState);

    // 初始化路由
    const hash = window.location.hash.slice(1);
    if (['home', 'tools', 'profile', 'fruit-promo', 'market-calendar'].includes(hash)) {
      setCurrentPage(hash);
    } else {
      window.history.replaceState({ page: 'home' }, '', '#home');
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentPage]);

  // 判断是否显示底部导航
  const showBottomNav = ['home', 'tools', 'profile'].includes(currentPage);

  return (
    <>
      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
      {currentPage === 'tools' && <ToolsPage onNavigate={handleNavigate} />}
      {currentPage === 'profile' && <ProfilePage />}
      {currentPage === 'fruit-promo' && <FruitPromoPage onBack={handleBack} />}
      {currentPage === 'market-calendar' && <MarketCalendarPage onBack={handleBack} />}

      {showBottomNav && <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />}
    </>
  );
};

export default App;
