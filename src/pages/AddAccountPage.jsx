import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Package } from 'lucide-react';
import StatusBar from '../components/StatusBar';
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

  // 从 localStorage 读取用户的赶集日历
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const savedMarkets = localStorage.getItem('marketSchedule');
    if (savedMarkets) {
      const markets = JSON.parse(savedMarkets);
      const locationList = markets.map((m) => m.name);
      setLocations(locationList);
    }
  }, []);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // 获取选中的库存信息
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

    const record = {
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
    };

    addSale(record);
    showToast('销售记录已保存！');
    onBack();
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans text-slate-900">
      <StatusBar isOnline={true} latency={24} />

      {/* 头部 */}
      <div className="bg-white sticky top-[34px] z-40 border-b border-gray-200 shadow-sm">
        <div className="px-5 pt-5 pb-4 flex justify-between items-end">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900 leading-none mb-1">记今天销售</h1>
              <p className="text-xs text-gray-400 font-mono italic">今天卖了多少</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md active:scale-95 transition-transform"
          >
            <Save size={16} />
            保存
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-10">
        {activeInventory.length === 0 ? (
          <div className="bg-white border border-gray-200 p-8 rounded-lg text-center">
            <Package size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-600 mb-2">还没有库存</p>
            <p className="text-xs text-gray-500 mb-4">请先添加进货记录</p>
            <button
              onClick={onBack}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-bold"
            >
              去添加进货
            </button>
          </div>
        ) : (
          <>
            {/* 基本信息 */}
            <div className="bg-white border border-gray-200 shadow-sm p-5 rounded-lg space-y-4">
              <h3 className="text-sm font-bold text-gray-700 mb-3">基本信息</h3>

              <div>
                <label className="text-xs text-gray-600 font-bold block mb-2">日期</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600 font-bold block mb-2">地点 *</label>
                <select
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
                >
                  <option value="">请选择地点</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                  <option value="其他">其他</option>
                </select>
              </div>
            </div>

            {/* 选择库存 */}
            <div className="bg-white border border-gray-200 shadow-sm p-5 rounded-lg space-y-4">
              <h3 className="text-sm font-bold text-gray-700 mb-3">选择库存 *</h3>

              <div className="space-y-2">
                {activeInventory.map((inv) => (
                  <label
                    key={inv.id}
                    className={`block border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      formData.inventoryId === inv.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="inventory"
                      value={inv.id}
                      checked={formData.inventoryId === inv.id}
                      onChange={(e) => handleChange('inventoryId', e.target.value)}
                      className="hidden"
                    />
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-900">{inv.fruit}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {inv.date} 进货 · ¥{inv.pricePerBox}/框
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-gray-900">
                          剩余 {inv.remainBoxes} 框
                        </p>
                        <p className="text-xs text-gray-500">共 {inv.boxes} 框</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 销售信息 */}
            <div className="bg-white border border-gray-200 shadow-sm p-5 rounded-lg space-y-4">
              <h3 className="text-sm font-bold text-gray-700 mb-3">销售信息</h3>

              <div>
                <label className="text-xs text-gray-600 font-bold block mb-2">
                  今天卖了多少框 *
                  {selectedInventory && (
                    <span className="text-gray-400 font-normal ml-2">
                      (最多 {selectedInventory.remainBoxes} 框)
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  value={formData.sellBoxes}
                  onChange={(e) => handleChange('sellBoxes', e.target.value)}
                  placeholder="5"
                  max={selectedInventory?.remainBoxes}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
                />
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600 font-bold block mb-2">💵 现金收入</label>
                  <input
                    type="number"
                    value={formData.cash}
                    onChange={(e) => handleChange('cash', e.target.value)}
                    placeholder="500"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 font-bold block mb-2">
                    💳 支付宝收入
                  </label>
                  <input
                    type="number"
                    value={formData.alipay}
                    onChange={(e) => handleChange('alipay', e.target.value)}
                    placeholder="300"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 font-bold block mb-2">💚 微信收入</label>
                  <input
                    type="number"
                    value={formData.wechat}
                    onChange={(e) => handleChange('wechat', e.target.value)}
                    placeholder="200"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                  总收入：<span className="font-bold text-gray-900">¥{totalIncome}</span>
                </p>
              </div>
            </div>

            {/* 统计结果 */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 shadow-lg p-5 rounded-lg text-white">
              <h3 className="text-sm font-bold mb-4 opacity-90">今日统计</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="opacity-90">成本</span>
                  <span className="font-bold">
                    {formData.sellBoxes || 0} 框 × ¥{costPerBox} = ¥{cost}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="opacity-90">收入</span>
                  <span className="font-bold">¥{totalIncome}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/20">
                  <span className="text-base font-bold">利润</span>
                  <span className="text-2xl font-black">
                    {profit >= 0 ? '+' : ''}¥{profit}
                  </span>
                </div>
              </div>
            </div>

            {/* 提示 */}
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
              <p className="text-xs text-orange-700 leading-relaxed">
                💡 保存后会自动从库存中扣减卖出的框数，并计算利润。
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddAccountPage;
