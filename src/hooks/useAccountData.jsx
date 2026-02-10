import { useState, useEffect } from 'react';
import { dataManager } from '../utils/dataManager';

export const useAccountData = () => {
  const [inventory, setInventory] = useState([]);
  const [sales, setSales] = useState([]);
  const [restDays, setRestDays] = useState([]);

  useEffect(() => {
    const data = dataManager.load();
    setInventory(data.inventory || []);
    setSales(data.sales || []);
    setRestDays(data.restDays || []);
  }, []);

  const saveAll = (inv, sal, rest) => {
    dataManager.save({ inventory: inv, sales: sal, restDays: rest });
  };

  // 添加休息日
  const addRestDay = (date) => {
    const dateStr = typeof date === 'string' ? date : new Date().toISOString().split('T')[0];
    if (restDays.includes(dateStr)) return; // 已标记过
    const newRestDays = [dateStr, ...restDays];
    setRestDays(newRestDays);
    saveAll(inventory, sales, newRestDays);
  };

  // 移除休息日
  const removeRestDay = (date) => {
    const newRestDays = restDays.filter((d) => d !== date);
    setRestDays(newRestDays);
    saveAll(inventory, sales, newRestDays);
  };

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
    saveAll(newInventory, sales, restDays);
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
    saveAll(updatedInventory, newSales, restDays);
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

  // 编辑进货记录
  const updateInventory = (id, updates) => {
    const updatedInventory = inventory.map((inv) => {
      if (inv.id === id) {
        return { ...inv, ...updates };
      }
      return inv;
    });
    setInventory(updatedInventory);
    saveAll(updatedInventory, sales, restDays);
  };

  // 删除进货记录
  const deleteInventory = (id) => {
    // 检查是否有关联的销售记录
    const hasSales = sales.some((s) => s.inventoryId === id);
    if (hasSales) {
      return { success: false, message: '该进货记录有关联的销售记录，无法删除' };
    }

    const newInventory = inventory.filter((inv) => inv.id !== id);
    setInventory(newInventory);
    saveAll(newInventory, sales, restDays);
    return { success: true };
  };

  // 编辑销售记录
  const updateSale = (id, updates) => {
    const oldSale = sales.find((s) => s.id === id);
    if (!oldSale) return;

    // 如果修改了卖出框数，需要更新库存
    if (updates.sellBoxes !== undefined && updates.sellBoxes !== oldSale.sellBoxes) {
      const diff = updates.sellBoxes - oldSale.sellBoxes;
      const updatedInventory = inventory.map((inv) => {
        if (inv.id === oldSale.inventoryId) {
          const newRemain = inv.remainBoxes - diff;
          return {
            ...inv,
            remainBoxes: newRemain,
            status: newRemain <= 0 ? 'finished' : 'active',
          };
        }
        return inv;
      });
      const updatedSales = sales.map((s) => (s.id === id ? { ...s, ...updates } : s));
      setInventory(updatedInventory);
      setSales(updatedSales);
      saveAll(updatedInventory, updatedSales, restDays);
    } else {
      const updatedSales = sales.map((s) => (s.id === id ? { ...s, ...updates } : s));
      setSales(updatedSales);
      saveAll(inventory, updatedSales, restDays);
    }
  };

  // 删除销售记录
  const deleteSale = (id) => {
    const sale = sales.find((s) => s.id === id);
    if (!sale) return;

    // 恢复库存
    const updatedInventory = inventory.map((inv) => {
      if (inv.id === sale.inventoryId) {
        const newRemain = inv.remainBoxes + sale.sellBoxes;
        return {
          ...inv,
          remainBoxes: newRemain,
          status: 'active',
        };
      }
      return inv;
    });

    const newSales = sales.filter((s) => s.id !== id);
    setInventory(updatedInventory);
    setSales(newSales);
    saveAll(updatedInventory, newSales, restDays);
  };

  return {
    inventory,
    sales,
    restDays,
    addInventory,
    addSale,
    addRestDay,
    removeRestDay,
    updateInventory,
    deleteInventory,
    updateSale,
    deleteSale,
    getActiveInventory,
    getStats,
    getTotalStock,
  };
};
