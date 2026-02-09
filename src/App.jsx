import { useState } from 'react';
import HomePage from './pages/HomePage';
import FruitPromoPage from './pages/FruitPromoPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigate = (pageId) => {
    if (pageId === 'fruit-promo') {
      setCurrentPage('fruit-promo');
    }
  };

  const handleBack = () => {
    setCurrentPage('home');
  };

  return (
    <>
      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
      {currentPage === 'fruit-promo' && <FruitPromoPage onBack={handleBack} />}
    </>
  );
};

export default App;
