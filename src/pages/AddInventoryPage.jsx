import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import StatusBar from '../components/StatusBar';
import { useAccountData } from '../hooks/useAccountData';
import { useToast } from '../components/Toast';

const AddInventoryPage = ({ onBack }) => {
  const { addInventory } = useAccountData();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    fruit: '',
    boxes: '',
    pricePerBox: '',
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const totalCost = (parseFloat(formData.boxes) || 0) * (parseFloat(formData.pricePerBox) || 0);

  const handleSave = () => {
    if (!formData.fruit || !formData.boxes || !formData.pricePerBox) {
      showToast('请填写所有信息', 'error');
      return;
    }

    const record = {
      date: formData.date,
      fruit: formData.fruit,
      boxes: parseFloat(formData.boxes),
      pricePerBox: parseFloat(formData.pricePerBox),
      totalCost,
    };

    addInventory(record);
    showToast('进货记录已保存！');
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
              <h1 className="text-2xl font-black text-gray-900 leading-none mb-1">添加进货</h1>
              <p className="text-xs text-gray-400 font-mono italic">记录拉货信息</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md active:scale-95 transition-transform"
          >
            <Save size={16} />
            保存
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-10">
        {/* 进货信息 */}
        <div className="bg-white border border-gray-200 shadow-sm p-5 rounded-lg space-y-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">进货信息</h3>

          <div>
            <label className="text-xs text-gray-600 font-bold block mb-2">进货日期</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 font-bold block mb-2">进货框数 *</label>
              <input
                type="number"
                value={formData.boxes}
                onChange={(e) => handleChange('boxes', e.target.value)}
                placeholder="50"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 font-bold block mb-2">单价(元/框) *</label>
              <input
                type="number"
                value={formData.pricePerBox}
                onChange={(e) => handleChange('pricePerBox', e.target.value)}
                placeholder="80"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
              />
            </div>
          </div>
        </div>

        {/* 统计 */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg p-5 rounded-lg text-white">
          <h3 className="text-sm font-bold mb-4 opacity-90">进货统计</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-90">总框数</span>
              <span className="text-xl font-black">{formData.boxes || 0} 框</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-white/20">
              <span className="text-base font-bold">总成本</span>
              <span className="text-2xl font-black">¥{totalCost}</span>
            </div>
          </div>
        </div>

        {/* 提示 */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-xs text-blue-700 leading-relaxed">
            💡 进货后可以在"销售记录"中记录每天卖了多少，系统会自动扣减库存并计算利润。
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddInventoryPage;
