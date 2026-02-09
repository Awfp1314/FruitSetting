import { useState } from 'react';
import { Plus, TrendingUp, DollarSign, Package, Box, ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import EditSaleModal from '../components/EditSaleModal';
import EditInventoryModal from '../components/EditInventoryModal';
import { useAccountData } from '../hooks/useAccountData';
import { useToast } from '../components/Toast';

const AccountPage = ({ onNavigate, onBack }) => {
  const {
    inventory,
    sales,
    deleteSale,
    deleteInventory,
    updateSale,
    updateInventory,
    getStats,
    getTotalStock,
    getActiveInventory,
  } = useAccountData();
  const [activeTab, setActiveTab] = useState('sales');
  const [editingSale, setEditingSale] = useState(null);
  const [editingInventory, setEditingInventory] = useState(null);
  const { showToast, showConfirm } = useToast();

  const handleDeleteSale = async (id) => {
    const confirmed = await showConfirm('确定要删除这条销售记录吗？删除后会恢复对应的库存。');
    if (confirmed) {
      deleteSale(id);
      showToast('销售记录已删除');
    }
  };

  const handleDeleteInventory = async (id) => {
    const result = deleteInventory(id);
    if (!result.success) {
      showToast(result.message, 'error');
    } else {
      showToast('进货记录已删除');
    }
  };

  const handleSaveSale = (updates) => {
    updateSale(editingSale.id, updates);
    setEditingSale(null);
  };

  const handleSaveInventory = (updates) => {
    updateInventory(editingInventory.id, updates);
    setEditingInventory(null);
  };

  const stats = getStats(30);
  const totalStock = getTotalStock();
  const activeInventory = getActiveInventory();

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans text-slate-900 pb-16">
      {/* 头部 + 标签页 */}
      <div className="bg-white shadow-sm">
        <div className="px-4 pt-4 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-xl font-black text-gray-900">记账本</h1>
          </div>
          <button
            onClick={() =>
              onNavigate(activeTab === 'sales' ? 'account-add-sale' : 'account-add-inventory')
            }
            className={`${
              activeTab === 'sales' ? 'bg-orange-500' : 'bg-blue-500'
            } text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md active:scale-95 transition-transform`}
          >
            <Plus size={14} />
            {activeTab === 'sales' ? '记销售' : '添进货'}
          </button>
        </div>

        <div className="flex">
          <button
            onClick={() => setActiveTab('sales')}
            className={`flex-1 py-2.5 text-sm font-bold transition-colors ${
              activeTab === 'sales'
                ? 'border-b-2 border-orange-500 text-orange-600'
                : 'text-gray-400'
            }`}
          >
            销售记录
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-2.5 text-sm font-bold transition-colors ${
              activeTab === 'inventory'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-400'
            }`}
          >
            库存管理
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeTab === 'sales' ? (
          <>
            {/* 本月统计 */}
            <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 rounded-2xl shadow-lg p-4 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-10 -mt-10"></div>
              <h2 className="text-xs font-bold mb-3 opacity-80">本月统计</h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/15 rounded-xl p-2.5">
                  <div className="flex items-center gap-1 mb-1 opacity-80">
                    <DollarSign size={12} />
                    <span className="text-[10px]">收入</span>
                  </div>
                  <p className="text-base font-black">¥{stats.totalIncome}</p>
                </div>
                <div className="bg-white/15 rounded-xl p-2.5">
                  <div className="flex items-center gap-1 mb-1 opacity-80">
                    <TrendingUp size={12} />
                    <span className="text-[10px]">利润</span>
                  </div>
                  <p className="text-base font-black">¥{stats.totalProfit}</p>
                </div>
                <div className="bg-white/15 rounded-xl p-2.5">
                  <div className="flex items-center gap-1 mb-1 opacity-80">
                    <Package size={12} />
                    <span className="text-[10px]">记录</span>
                  </div>
                  <p className="text-base font-black">{stats.saleCount}笔</p>
                </div>
              </div>
            </div>

            {/* 销售记录列表 */}
            <div className="space-y-2">
              {sales.length === 0 ? (
                <div className="bg-white p-10 rounded-2xl text-center">
                  <Package size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-400 text-sm mb-1">还没有销售记录</p>
                  <p className="text-xs text-gray-400">先添加进货，再记录销售</p>
                </div>
              ) : (
                sales.map((sale) => (
                  <div key={sale.id} className="bg-white rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-bold text-gray-900">{sale.fruit}</span>
                          <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                            {sale.location}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400">
                          {sale.date} · {sale.sellBoxes}框
                        </p>
                      </div>
                      <p
                        className={`text-base font-black flex-shrink-0 ${
                          sale.profit >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {sale.profit >= 0 ? '+' : ''}¥{sale.profit}
                      </p>
                      <div className="flex flex-col gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => setEditingSale(sale)}
                          className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={14} className="text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteSale(sale.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} className="text-gray-300" />
                        </button>
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
            <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-500 rounded-2xl shadow-lg p-4 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-10 -mt-10"></div>
              <h2 className="text-xs font-bold mb-3 opacity-80">当前库存</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/15 rounded-xl p-3 flex items-center gap-3">
                  <Box size={28} className="opacity-80" />
                  <div>
                    <p className="text-[10px] opacity-80">总剩余</p>
                    <p className="text-2xl font-black">{totalStock}框</p>
                  </div>
                </div>
                <div className="bg-white/15 rounded-xl p-3 flex items-center gap-3">
                  <Package size={28} className="opacity-80" />
                  <div>
                    <p className="text-[10px] opacity-80">活跃批次</p>
                    <p className="text-2xl font-black">{activeInventory.length}批</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 库存列表 */}
            <div className="space-y-2">
              {inventory.length === 0 ? (
                <div className="bg-white p-10 rounded-2xl text-center">
                  <Box size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-400 text-sm mb-1">还没有进货记录</p>
                  <p className="text-xs text-gray-400">点击右上角"添进货"开始</p>
                </div>
              ) : (
                inventory.map((inv) => {
                  const hasSales = sales.some((s) => s.inventoryId === inv.id);
                  const percent =
                    inv.boxes > 0 ? Math.round((inv.remainBoxes / inv.boxes) * 100) : 0;
                  return (
                    <div
                      key={inv.id}
                      className={`bg-white rounded-xl p-4 ${
                        inv.status !== 'active' ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-bold text-gray-900">{inv.fruit}</span>
                            {inv.status === 'active' ? (
                              <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                在售
                              </span>
                            ) : (
                              <span className="bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                售完
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-400">
                            {inv.date} · ¥{inv.pricePerBox}/框 · 成本¥{inv.totalCost}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-base font-black text-gray-900">
                            {inv.remainBoxes}/{inv.boxes}
                          </p>
                          <p className="text-[10px] text-gray-400">框</p>
                        </div>
                        <div className="flex flex-col gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => setEditingInventory(inv)}
                            className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={14} className="text-gray-400" />
                          </button>
                          {!hasSales && (
                            <button
                              onClick={() => handleDeleteInventory(inv.id)}
                              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={14} className="text-gray-300" />
                            </button>
                          )}
                        </div>
                      </div>
                      {/* 库存进度条 */}
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2.5">
                        <div
                          className={`h-full rounded-full transition-all ${
                            percent > 50
                              ? 'bg-blue-500'
                              : percent > 20
                                ? 'bg-orange-500'
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>

      {editingSale && (
        <EditSaleModal
          sale={editingSale}
          inventory={inventory.find((inv) => inv.id === editingSale.inventoryId)}
          onSave={handleSaveSale}
          onClose={() => setEditingSale(null)}
        />
      )}
      {editingInventory && (
        <EditInventoryModal
          inventory={editingInventory}
          hasSales={sales.some((s) => s.inventoryId === editingInventory.id)}
          onSave={handleSaveInventory}
          onClose={() => setEditingInventory(null)}
        />
      )}
    </div>
  );
};

export default AccountPage;
