import { useState, useEffect } from 'react';
import { dataManager } from '../utils/dataManager';

export const useAccountData = () => {
  const [inventory, setInventory] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const data = dataManager.load();
    setInventory(data.inventory || []);
    setSales(data.sales || []);
  }, []);

  // 添加进货
  const addInventory = (record) => {
    const newRecord = {
      id: Date.now().toString(),
      ...record,
      remainBoxes: record.boxes,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    const newInventory = [newRecord, ...inventory];
    setInventory(newInventory);
    dataManager.save({ inventory: newInventory, sales });
    return newRecord;
  };

  // 添加销售记录
  const addSale = (record) => {
    const newRecord = {
      id: Date.now().toString(),
      ...record,
      createdAt: new Date().toISOString(),
    };

    // 更新库存
    const updatedInventory = inventory.map((inv) => {
      if (inv.id === record.inventoryId) {
        const newRemain = inv.remainBoxes - record.sellBoxes;
        return {
          ...inv,
          remainBoxes: newRemain,
          status: newRemain <= 0 ? 'finished' : 'active',
        };
      }
      return inv;
    });

    const newSales = [newRecord, ...sales];
    setInventory(updatedInventory);
    setSales(newSales);
    dataManager.save({ inventory: updatedInventory, sales: newSales });
    return newRecord;
  };

  // 获取活跃库存（还有剩余的）
  const getActiveInventory = () => {
    return inventory.filter((inv) => inv.status === 'active' && inv.remainBoxes > 0);
  };

  // 获取统计数据
  const getStats = (days = 30) => {
    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const recentSales = sales.filter((s) => new Date(s.date) >= startDate);

    const totalIncome = recentSales.reduce((sum, s) => sum + (s.totalIncome || 0), 0);
    const totalProfit = recentSales.reduce((sum, s) => sum + (s.profit || 0), 0);
    const totalCost = recentSales.reduce((sum, s) => sum + (s.cost || 0), 0);

    return {
      totalIncome,
      totalProfit,
      totalCost,
      saleCount: recentSales.length,
    };
  };

  // 获取总库存数量
  const getTotalStock = () => {
    return inventory.reduce((sum, inv) => {
      if (inv.status === 'active') {
        return sum + inv.remainBoxes;
      }
      return sum;
    }, 0);
  };

  return {
    inventory,
    sales,
    addInventory,
    addSale,
    getActiveInventory,
    getStats,
    getTotalStock,
  };
};
