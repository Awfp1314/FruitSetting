import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
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
    addInventory({
      date: formData.date,
      fruit: formData.fruit,
      boxes: parseFloat(formData.boxes),
      pricePerBox: parseFloat(formData.pricePerBox),
      totalCost,
    });
    showToast('进货记录已保存！');
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
            <h1 className="text-xl font-black text-gray-900">添加进货</h1>
          </div>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md active:scale-95 transition-transform"
          >
            <Save size={14} />
            保存
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-10">
        {/* 进货信息 */}
        <div className="bg-white rounded-2xl p-4 space-y-3">
          <div>
            <label className="text-[11px] text-gray-500 font-bold block mb-1.5">进货日期</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:border-blue-300 transition-colors outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] text-gray-500 font-bold block mb-1.5">水果种类 *</label>
            <input
              type="text"
              value={formData.fruit}
              onChange={(e) => handleChange('fruit', e.target.value)}
              placeholder="如：冰糖梨、苹果"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:border-blue-300 transition-colors outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-gray-500 font-bold block mb-1.5">进货框数 *</label>
              <input
                type="number"
                value={formData.boxes}
                onChange={(e) => handleChange('boxes', e.target.value)}
                placeholder="50"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:border-blue-300 transition-colors outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] text-gray-500 font-bold block mb-1.5">
                单价(元/框) *
              </label>
              <input
                type="number"
                value={formData.pricePerBox}
                onChange={(e) => handleChange('pricePerBox', e.target.value)}
                placeholder="80"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:border-blue-300 transition-colors outline-none"
              />
            </div>
          </div>
        </div>

        {/* 进货统计 */}
        <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-500 rounded-2xl shadow-lg p-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-8 -mt-8"></div>
          <h3 className="text-xs font-bold mb-3 opacity-80">进货统计</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/15 rounded-xl p-3">
              <p className="text-[10px] opacity-80 mb-1">总框数</p>
              <p className="text-xl font-black">{formData.boxes || 0} 框</p>
            </div>
            <div className="bg-white/15 rounded-xl p-3">
              <p className="text-[10px] opacity-80 mb-1">总成本</p>
              <p className="text-xl font-black">¥{totalCost}</p>
            </div>
          </div>
        </div>

        {/* 提示 */}
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs">💡</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              进货后可以在"销售记录"中记录每天卖了多少，系统会自动扣减库存并计算利润。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInventoryPage;
