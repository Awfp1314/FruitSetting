import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Package, Check } from 'lucide-react';
import { useAccountData } from '../hooks/useAccountData';
import { useToast } from '../components/Toast';

const AddAccountPage = ({ onBack }) => {
  const { addSale, getActiveInventory } = useAccountData();
  const { showToast } = useToast();
  const activeInventory = getActiveInventory();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    location: '',
    inventoryId: '',
    sellBoxes: '',
    cash: '',
    alipay: '',
    wechat: '',
  });

  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const savedMarkets = localStorage.getItem('marketSchedule');
    if (savedMarkets) {
      const markets = JSON.parse(savedMarkets);
      setLocations(markets.map((m) => m.name));
    }
  }, []);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const selectedInventory = activeInventory.find((inv) => inv.id === formData.inventoryId);

  const calculate = () => {
    const sellBoxes = parseFloat(formData.sellBoxes) || 0;
    const cash = parseFloat(formData.cash) || 0;
    const alipay = parseFloat(formData.alipay) || 0;
    const wechat = parseFloat(formData.wechat) || 0;
    const totalIncome = cash + alipay + wechat;
    const costPerBox = selectedInventory ? selectedInventory.pricePerBox : 0;
    const cost = sellBoxes * costPerBox;
    const profit = totalIncome - cost;
    return { totalIncome, cost, profit, costPerBox };
  };

  const { totalIncome, cost, profit, costPerBox } = calculate();

  const handleSave = () => {
    if (!formData.location || !formData.inventoryId || !formData.sellBoxes) {
      showToast('请填写必填项：地点、选择库存、卖出框数', 'error');
      return;
    }
    const sellBoxes = parseFloat(formData.sellBoxes);
    if (selectedInventory && sellBoxes > selectedInventory.remainBoxes) {
      showToast(`库存不足！当前剩余 ${selectedInventory.remainBoxes} 框`, 'error');
      return;
    }
    addSale({
      date: formData.date,
      location: formData.location,
      inventoryId: formData.inventoryId,
      fruit: selectedInventory.fruit,
      sellBoxes,
      cash: parseFloat(formData.cash) || 0,
      alipay: parseFloat(formData.alipay) || 0,
      wechat: parseFloat(formData.wechat) || 0,
      totalIncome,
      costPerBox,
      cost,
      profit,
    });
    showToast('销售记录已保存！');
    onBack();
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans text-slate-900">
      {/* 头部 */}
      <div className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="px-4 pt-4 pb-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-xl font-black text-gray-900">记今天销售</h1>
          </div>
          <button
            onClick={handleSave}
            className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md active:scale-95 transition-transform"
          >
            <Save size={14} />
            保存
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-10">
        {activeInventory.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl text-center">
            <Package size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-600 mb-1">还没有库存</p>
            <p className="text-xs text-gray-400 mb-4">请先添加进货记录</p>
            <button
              onClick={onBack}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-bold"
            >
              去添加进货
            </button>
          </div>
        ) : (
          <>
            {/* 日期和地点 */}
            <div className="bg-white rounded-2xl p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-gray-500 font-bold block mb-1.5">日期</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:border-orange-300 transition-colors outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 font-bold block mb-1.5">地点 *</label>
                  <select
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:border-orange-300 transition-colors outline-none"
                  >
                    <option value="">选择地点</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                    <option value="其他">其他</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 选择库存 */}
            <div className="bg-white rounded-2xl p-4">
              <label className="text-[11px] text-gray-500 font-bold block mb-2">选择库存 *</label>
              <div className="space-y-2">
                {activeInventory.map((inv) => (
                  <button
                    key={inv.id}
                    onClick={() => handleChange('inventoryId', inv.id)}
                    className={`w-full text-left rounded-xl p-3 transition-all border-2 ${
                      formData.inventoryId === inv.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            formData.inventoryId === inv.id
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          {formData.inventoryId === inv.id ? (
                            <Check size={16} />
                          ) : (
                            <Package size={16} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{inv.fruit}</p>
                          <p className="text-[10px] text-gray-400">
                            ¥{inv.pricePerBox}/框 · {inv.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-gray-900">剩{inv.remainBoxes}框</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 销售数量 */}
            <div className="bg-white rounded-2xl p-4">
              <label className="text-[11px] text-gray-500 font-bold block mb-1.5">
                卖了多少框 *
                {selectedInventory && (
                  <span className="text-gray-400 font-normal ml-1">
                    (最多{selectedInventory.remainBoxes}框)
                  </span>
                )}
              </label>
              <input
                type="number"
                value={formData.sellBoxes}
                onChange={(e) => handleChange('sellBoxes', e.target.value)}
                placeholder="输入框数"
                max={selectedInventory?.remainBoxes}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:border-orange-300 transition-colors outline-none"
              />
            </div>

            {/* 收入明细 */}
            <div className="bg-white rounded-2xl p-4 space-y-3">
              <label className="text-[11px] text-gray-500 font-bold block">收入明细</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">💵 现金</label>
                  <input
                    type="number"
                    value={formData.cash}
                    onChange={(e) => handleChange('cash', e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:border-orange-300 transition-colors outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">💳 支付宝</label>
                  <input
                    type="number"
                    value={formData.alipay}
                    onChange={(e) => handleChange('alipay', e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:border-orange-300 transition-colors outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">💚 微信</label>
                  <input
                    type="number"
                    value={formData.wechat}
                    onChange={(e) => handleChange('wechat', e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:border-orange-300 transition-colors outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 今日统计 */}
            <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 rounded-2xl shadow-lg p-4 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-8 -mt-8"></div>
              <h3 className="text-xs font-bold mb-3 opacity-80">今日统计</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="opacity-80">成本</span>
                  <span className="font-bold">
                    {formData.sellBoxes || 0}框 × ¥{costPerBox} = ¥{cost}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="opacity-80">收入</span>
                  <span className="font-bold">¥{totalIncome}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/20">
                  <span className="text-sm font-bold">利润</span>
                  <span className="text-xl font-black">
                    {profit >= 0 ? '+' : ''}¥{profit}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddAccountPage;
