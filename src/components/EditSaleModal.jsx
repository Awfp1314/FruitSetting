import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const EditSaleModal = ({ sale, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    location: sale.location,
    cash: sale.cash,
    alipay: sale.alipay,
    wechat: sale.wechat,
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const totalIncome =
    (parseFloat(formData.cash) || 0) +
    (parseFloat(formData.alipay) || 0) +
    (parseFloat(formData.wechat) || 0);

  const handleSave = () => {
    const updates = {
      location: formData.location,
      cash: parseFloat(formData.cash) || 0,
      alipay: parseFloat(formData.alipay) || 0,
      wechat: parseFloat(formData.wechat) || 0,
      totalIncome,
      profit: totalIncome - sale.cost,
    };
    onSave(updates);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-orange-500 to-red-500">
          <h3 className="text-lg font-bold text-white">编辑销售记录</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded transition-colors">
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <p className="text-gray-600">
              {sale.fruit} · {sale.date}
            </p>
            <p className="text-gray-500 text-xs mt-1">卖了 {sale.sellBoxes} 框</p>
          </div>

          <div>
            <label className="text-xs text-gray-600 font-bold block mb-2">地点</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 font-bold block mb-2">💵 现金收入</label>
            <input
              type="number"
              value={formData.cash}
              onChange={(e) => handleChange('cash', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 font-bold block mb-2">💳 支付宝收入</label>
            <input
              type="number"
              value={formData.alipay}
              onChange={(e) => handleChange('alipay', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 font-bold block mb-2">💚 微信收入</label>
            <input
              type="number"
              value={formData.wechat}
              onChange={(e) => handleChange('wechat', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
            />
          </div>

          <div className="bg-orange-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              总收入：<span className="font-bold text-gray-900">¥{totalIncome}</span>
            </p>
          </div>
        </div>

        {/* 底部 */}
        <div className="px-5 py-3 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-orange-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-orange-600"
          >
            <Save size={16} />
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSaleModal;
