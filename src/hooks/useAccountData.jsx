import { useState, useEffect } from 'react';
import { dataManager } from '../utils/dataManager';

export const useAccountData = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const data = dataManager.load();
    setRecords(data.records || []);
  }, []);

  const addRecord = (record) => {
    const newRecord = {
      id: Date.now().toString(),
      ...record,
      createdAt: new Date().toISOString(),
    };
    const newRecords = [newRecord, ...records];
    setRecords(newRecords);
    dataManager.save({ records: newRecords });
    return newRecord;
  };

  const updateRecord = (id, updates) => {
    const newRecords = records.map((r) => (r.id === id ? { ...r, ...updates } : r));
    setRecords(newRecords);
    dataManager.save({ records: newRecords });
  };

  const deleteRecord = (id) => {
    const newRecords = records.filter((r) => r.id !== id);
    setRecords(newRecords);
    dataManager.save({ records: newRecords });
  };

  const getStats = (days = 30) => {
    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const recentRecords = records.filter((r) => new Date(r.date) >= startDate);

    const totalIncome = recentRecords.reduce((sum, r) => sum + (r.totalIncome || 0), 0);
    const totalProfit = recentRecords.reduce((sum, r) => sum + (r.profit || 0), 0);
    const totalCost = recentRecords.reduce((sum, r) => sum + (r.totalCost || 0), 0);

    return {
      totalIncome,
      totalProfit,
      totalCost,
      recordCount: recentRecords.length,
    };
  };

  return {
    records,
    addRecord,
    updateRecord,
    deleteRecord,
    getStats,
  };
};
