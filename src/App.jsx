import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import FruitPromoPage from './pages/FruitPromoPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigate = (pageId) => {
    if (pageId === 'fruit-promo') {
      setCurrentPage('fruit-promo');
      // 添加一个历史记录，这样返回键可以被拦截
      window.history.pushState({ page: 'fruit-promo' }, '', '#fruit-promo');
    }
  };

  const handleBack = () => {
    setCurrentPage('home');
    // 返回到主页时，更新 URL
    window.history.pushState({ page: 'home' }, '', '#home');
  };

  useEffect(() => {
    // 监听浏览器返回事件
    const handlePopState = (event) => {
      if (currentPage === 'fruit-promo') {
        // 如果在二级页面，返回到主页
        setCurrentPage('home');
      } else {
        // 如果在主页，允许退出
        window.history.back();
      }
    };

    window.addEventListener('popstate', handlePopState);

    // 初始化时添加一个历史记录
    if (window.location.hash === '#fruit-promo') {
      setCurrentPage('fruit-promo');
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
    </>
  );
};

export default App;
