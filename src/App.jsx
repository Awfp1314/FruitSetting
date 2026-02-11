import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import FruitPromoPage from './pages/FruitPromoPage';
import MarketCalendarPage from './pages/MarketCalendarPage';
import AccountPage from './pages/AccountPage';
import AddAccountPage from './pages/AddAccountPage';
import AddInventoryPage from './pages/AddInventoryPage';
import AIChatPage from './pages/AIChatPage';
import BottomNav from './components/BottomNav';
import UpdateModal from './components/UpdateModal';
import { ToastProvider } from './components/Toast';
import { useVersionCheck } from './hooks/useVersionCheck';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState(null);
  const { showUpdateModal, newVersion, closeUpdateModal } = useVersionCheck();

  // 前进导航：push 新记录到历史栈
  const handleNavigate = (pageId, params = null) => {
    setCurrentPage(pageId);
    setPageParams(params);
    window.history.pushState({ page: pageId, params }, '', `#${pageId}`);
  };

  // 返回导航：用浏览器的 back，让 popstate 处理页面切换
  const handleBack = () => {
    window.history.back();
  };

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
        setPageParams(event.state.params || null);
      } else {
        setCurrentPage('home');
        setPageParams(null);
      }
    };

    window.addEventListener('popstate', handlePopState);

    // 初始化路由
    const hash = window.location.hash.slice(1);
    const validPages = [
      'home',
      'profile',
      'fruit-promo',
      'market-calendar',
      'account',
      'account-add-sale',
      'account-add-inventory',
      'ai-chat',
    ];

    if (validPages.includes(hash)) {
      setCurrentPage(hash);
      window.history.replaceState({ page: hash }, '', `#${hash}`);
    } else {
      window.history.replaceState({ page: 'home' }, '', '#home');
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // 判断是否显示底部导航
  const showBottomNav = ['home', 'profile'].includes(currentPage);

  return (
    <ToastProvider>
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden">
          {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
          {currentPage === 'profile' && <ProfilePage />}
          {currentPage === 'fruit-promo' && <FruitPromoPage onBack={handleBack} />}
          {currentPage === 'market-calendar' && <MarketCalendarPage onBack={handleBack} />}
          {currentPage === 'account' && (
            <AccountPage onNavigate={handleNavigate} onBack={handleBack} />
          )}
          {currentPage === 'account-add-sale' && <AddAccountPage onBack={handleBack} />}
          {currentPage === 'account-add-inventory' && <AddInventoryPage onBack={handleBack} />}
          {currentPage === 'ai-chat' && <AIChatPage onBack={handleBack} />}
        </div>

        {showBottomNav && (
          <BottomNav
            currentPage={currentPage}
            onNavigate={(pageId) => {
              setCurrentPage(pageId);
              setPageParams(null);
              window.history.replaceState({ page: pageId }, '', `#${pageId}`);
            }}
          />
        )}
      </div>

      {/* 版本更新弹窗 */}
      {showUpdateModal && <UpdateModal version={newVersion} onClose={closeUpdateModal} />}
    </ToastProvider>
  );
};

export default App;
