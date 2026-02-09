import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import StatusBar from '../components/StatusBar';
import { useAccountData } from '../hooks/useAccountData';

const AddAccountPage = ({ onBack }) => {
  const { addRecord } = useAccountData();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    location: '',
    fruit: '',
    buyBoxes: '',
    buyPrice: '',
    sellBoxes: '',
    cash: '',
    alipay: '',
    wechat: '',
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const calculate = () => {
    const buyBoxes = parseFloat(formData.buyBoxes) || 0;
    const buyPrice = parseFloat(formData.buyPrice) || 0;
    const sellBoxes = parseFloat(formData.sellBoxes) || 0;
    const cash = parseFloat(formData.cash) || 0;
    const alipay = parseFloat(formData.alipay) || 0;
    const wechat = parseFloat(formData.wechat) || 0;

    const totalCost = buyBoxes * buyPrice;
    const totalIncome = cash + alipay + wechat;
    const profit = totalIncome - totalCost;
    const remainBoxes = buyBoxes - sellBoxes;

    return { totalCost, totalIncome, profit, remainBoxes };
  };

  const { totalCost, totalIncome, profit, remainBoxes } = calculate();

  const handleSave = () => {
    if (!formData.location || !formData.fruit || !formData.buyBoxes) {
      alert('请填写必填项：地点、水果、进货框数');
      return;
    }

    const record = {
      ...formData,
      buyBoxes: parseFloat(formData.buyBoxes),
      buyPrice: parseFloat(formData.buyPrice) || 0,
      sellBoxes: parseFloat(formData.sellBoxes) || 0,
      cash: parseFloat(formData.cash) || 0,
      alipay: parseFloat(formData.alipay) || 0,
      wechat: parseFloat(formData.wechat) || 0,
      totalCost,
      totalIncome,
      profit,
      remainBoxes,
    };

    addRecord(record);
    alert('保存成功！');
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
              <h1 className="text-2xl font-black text-gray-900 leading-none mb-1">记一笔</h1>
              <p className="text-xs text-gray-400 font-mono italic">今天的收支</p>
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
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="如：榆林子、县城"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 font-bold block mb-2">水果种类 *</label>
            <input
              type="text"
              value={formData.fruit}
              onChange={(e) => handleChange('fruit', e.target.value)}
              placeholder="如：冰糖梨、苹果"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
            />
          </div>
        </div>

        {/* 进货信息 */}
        <div className="bg-white border border-gray-200 shadow-sm p-5 rounded-lg space-y-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">进货信息</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 font-bold block mb-2">进货框数 *</label>
              <input
                type="number"
                value={formData.buyBoxes}
                onChange={(e) => handleChange('buyBoxes', e.target.value)}
                placeholder="50"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 font-bold block mb-2">单价(元/框)</label>
              <input
                type="number"
                value={formData.buyPrice}
                onChange={(e) => handleChange('buyPrice', e.target.value)}
                placeholder="80"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              总成本：<span className="font-bold text-gray-900">¥{totalCost}</span>
            </p>
          </div>
        </div>

        {/* 销售信息 */}
        <div className="bg-white border border-gray-200 shadow-sm p-5 rounded-lg space-y-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">销售信息</h3>

          <div>
            <label className="text-xs text-gray-600 font-bold block mb-2">卖出框数</label>
            <input
              type="number"
              value={formData.sellBoxes}
              onChange={(e) => handleChange('sellBoxes', e.target.value)}
              placeholder="45"
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
                placeholder="2000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 font-bold block mb-2">💳 支付宝收入</label>
              <input
                type="number"
                value={formData.alipay}
                onChange={(e) => handleChange('alipay', e.target.value)}
                placeholder="1500"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 font-bold block mb-2">💚 微信收入</label>
              <input
                type="number"
                value={formData.wechat}
                onChange={(e) => handleChange('wechat', e.target.value)}
                placeholder="800"
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
          <h3 className="text-sm font-bold mb-4 opacity-90">统计结果</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-90">剩余框数</span>
              <span className="text-xl font-black">{remainBoxes} 框</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-white/20">
              <span className="text-base font-bold">利润</span>
              <span className="text-2xl font-black">
                {profit >= 0 ? '+' : ''}¥{profit}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAccountPage;
