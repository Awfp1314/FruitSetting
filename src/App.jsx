import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import FruitPromoPage from './pages/FruitPromoPage';
import MarketCalendarPage from './pages/MarketCalendarPage';
import AccountPage from './pages/AccountPage';
import AddAccountPage from './pages/AddAccountPage';
import AddInventoryPage from './pages/AddInventoryPage';
import BottomNav from './components/BottomNav';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState(null);

  const handleNavigate = (pageId, params = null) => {
    setCurrentPage(pageId);
    setPageParams(params);
    window.history.pushState({ page: pageId, params }, '', `#${pageId}`);
  };

  const handleBack = () => {
    // 从工具页面返回到首页
    setCurrentPage('home');
    setPageParams(null);
    window.history.pushState({ page: 'home' }, '', '#home');
  };

  useEffect(() => {
    const handlePopState = (event) => {
      // 如果在工具详情页，返回到首页
      if (
        currentPage === 'fruit-promo' ||
        currentPage === 'market-calendar' ||
        currentPage === 'account' ||
        currentPage === 'account-add-sale' ||
        currentPage === 'account-add-inventory'
      ) {
        setCurrentPage('home');
        setPageParams(null);
      }
      // 如果在主要页面（home/profile），允许退出
      else {
        window.history.back();
      }
    };

    window.addEventListener('popstate', handlePopState);

    // 初始化路由
    const hash = window.location.hash.slice(1);
    if (
      [
        'home',
        'profile',
        'fruit-promo',
        'market-calendar',
        'account',
        'account-add-sale',
        'account-add-inventory',
      ].includes(hash)
    ) {
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
      {currentPage === 'account' && <AccountPage onNavigate={handleNavigate} />}
      {currentPage === 'account-add-sale' && <AddAccountPage onBack={handleBack} />}
      {currentPage === 'account-add-inventory' && <AddInventoryPage onBack={handleBack} />}

      {showBottomNav && <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />}
    </>
  );
};

export default App;
