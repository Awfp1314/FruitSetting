import { useState } from 'react';
import { Plus, TrendingUp, DollarSign, Package, Box } from 'lucide-react';
import StatusBar from '../components/StatusBar';
import { useAccountData } from '../hooks/useAccountData';

const AccountPage = ({ onNavigate }) => {
  const { inventory, sales, getStats, getTotalStock, getActiveInventory } = useAccountData();
  const [activeTab, setActiveTab] = useState('sales'); // sales | inventory

  const stats = getStats(30);
  const totalStock = getTotalStock();
  const activeInventory = getActiveInventory();

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans text-slate-900 pb-16">
      <StatusBar isOnline={true} latency={24} />

      {/* 头部 */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-5 pt-5 pb-4">
          <h1 className="text-2xl font-black text-gray-900 leading-none mb-1">记账本</h1>
          <p className="text-xs text-gray-400 font-mono italic">进货和销售管理</p>
        </div>

        {/* 标签页 */}
        <div className="flex border-t border-gray-200">
          <button
            onClick={() => setActiveTab('sales')}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${
              activeTab === 'sales'
                ? 'bg-orange-50 border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-400'
            }`}
          >
            销售记录
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${
              activeTab === 'inventory'
                ? 'bg-blue-50 border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-400'
            }`}
          >
            库存管理
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'sales' ? (
          <>
            {/* 本月统计 */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 shadow-lg p-5 rounded-lg text-white">
              <h2 className="text-sm font-bold mb-4 opacity-90">本月统计</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center gap-1 mb-1 opacity-80">
                    <DollarSign size={14} />
                    <span className="text-xs">收入</span>
                  </div>
                  <p className="text-xl font-black">¥{stats.totalIncome}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1 opacity-80">
                    <TrendingUp size={14} />
                    <span className="text-xs">利润</span>
                  </div>
                  <p className="text-xl font-black">¥{stats.totalProfit}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1 opacity-80">
                    <Package size={14} />
                    <span className="text-xs">记录</span>
                  </div>
                  <p className="text-xl font-black">{stats.saleCount}笔</p>
                </div>
              </div>
            </div>

            {/* 快捷操作 */}
            <button
              onClick={() => onNavigate('account-add-sale')}
              className="w-full bg-orange-500 text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-transform"
            >
              <Plus size={24} />
              记今天销售
            </button>

            {/* 销售记录列表 */}
            <div className="space-y-3">
              {sales.length === 0 ? (
                <div className="bg-white border border-gray-200 p-8 rounded-lg text-center">
                  <p className="text-gray-400 mb-2">还没有销售记录</p>
                  <p className="text-xs text-gray-500">先添加进货，再记录销售</p>
                </div>
              ) : (
                sales.map((sale) => (
                  <div
                    key={sale.id}
                    className="bg-white border border-gray-200 shadow-sm p-4 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base font-bold text-gray-900">{sale.fruit}</span>
                          <span className="text-xs text-gray-500">{sale.location}</span>
                        </div>
                        <p className="text-xs text-gray-400">{sale.date}</p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg font-black ${
                            sale.profit >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {sale.profit >= 0 ? '+' : ''}¥{sale.profit}
                        </p>
                        <p className="text-xs text-gray-500">卖了 {sale.sellBoxes} 框</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <>
            {/* 库存概览 */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg p-5 rounded-lg text-white">
              <h2 className="text-sm font-bold mb-4 opacity-90">当前库存</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Box size={32} />
                  <div>
                    <p className="text-xs opacity-80">总剩余</p>
                    <p className="text-3xl font-black">{totalStock}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-80">活跃批次</p>
                  <p className="text-2xl font-black">{activeInventory.length}</p>
                </div>
              </div>
            </div>

            {/* 添加进货按钮 */}
            <button
              onClick={() => onNavigate('account-add-inventory')}
              className="w-full bg-blue-500 text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-transform"
            >
              <Plus size={24} />
              添加进货
            </button>

            {/* 库存列表 */}
            <div className="space-y-3">
              {inventory.length === 0 ? (
                <div className="bg-white border border-gray-200 p-8 rounded-lg text-center">
                  <p className="text-gray-400 mb-2">还没有进货记录</p>
                  <button
                    onClick={() => onNavigate('account-add-inventory')}
                    className="text-blue-600 font-bold text-sm"
                  >
                    点击"添加进货"开始
                  </button>
                </div>
              ) : (
                inventory.map((inv) => (
                  <div
                    key={inv.id}
                    className={`bg-white border shadow-sm p-4 rounded-lg ${
                      inv.status === 'active' ? 'border-blue-200' : 'border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base font-bold text-gray-900">{inv.fruit}</span>
                          {inv.status === 'active' ? (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">
                              在售
                            </span>
                          ) : (
                            <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full font-bold">
                              已售完
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{inv.date} 进货</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-gray-900">
                          {inv.remainBoxes}/{inv.boxes} 框
                        </p>
                        <p className="text-xs text-gray-500">¥{inv.pricePerBox}/框</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-3 py-2 rounded text-xs text-gray-600">
                      总成本：¥{inv.totalCost}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
