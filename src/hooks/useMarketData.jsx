import { useState, useEffect } from 'react';
import { MARKET_SCHEDULE } from '../constants/marketData';

export const useMarketData = () => {
  const [markets, setMarkets] = useState([]);

  useEffect(() => {
    const savedData = localStorage.getItem('marketSchedule');
    if (savedData) {
      setMarkets(JSON.parse(savedData));
    } else {
      setMarkets(MARKET_SCHEDULE);
    }
  }, []);

  useEffect(() => {
    if (markets.length > 0) {
      localStorage.setItem('marketSchedule', JSON.stringify(markets));
    }
  }, [markets]);

  const addMarket = (market) => {
    setMarkets([...markets, market]);
  };

  const updateMarket = (index, updatedMarket) => {
    const newMarkets = [...markets];
    newMarkets[index] = updatedMarket;
    setMarkets(newMarkets);
  };

  const deleteMarket = (index) => {
    setMarkets(markets.filter((_, i) => i !== index));
  };

  const resetToDefault = () => {
    setMarkets(MARKET_SCHEDULE);
    localStorage.setItem('marketSchedule', JSON.stringify(MARKET_SCHEDULE));
  };

  return {
    markets,
    addMarket,
    updateMarket,
    deleteMarket,
    resetToDefault,
  };
};
