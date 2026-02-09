import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { MARKET_SCHEDULE } from '../constants/marketData';

const EditSaleModal = ({ sale, inventory, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    location: sale.location,
    sellBoxes: sale.sellBoxes,
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

  const sellBoxes = parseFloat(formData.sellBoxes) || 0;
  const cost = sellBoxes * sale.costPerBox;
  const profit = totalIncome - cost;

  // 计算可用框数（原来卖的 + 库存剩余）
  const maxBoxes = sale.sellBoxes + inventory.remainBoxes;

  const handleSave = () => {
    if (sellBoxes > maxBoxes) {
      alert(`最多只能卖 ${maxBoxes} 框（库存不足）`);
      return;
    }

    const updates = {
      location: formData.location,
      sellBoxes,
      cash: parseFloat(formData.cash) || 0,
      alipay: parseFloat(formData.alipay) || 0,
      wechat: parseFloat(formData.wechat) || 0,
      totalIncome,
      cost,
      profit,
    };
    onSave(updates);
  };

  // 获取地点列表（从赶集日历 + 自定义）
  const locations = [
    ...MARKET_SCHEDULE.map((m) => m.shortName),
    '其他', // 允许自定义
  ];

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
            <p className="text-gray-500 text-xs mt-1">成本 ¥{sale.costPerBox}/框</p>
          </div>

          <div>
            <label className="text-xs text-gray-600 font-bold block mb-2">地点</label>
            <select
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-600 font-bold block mb-2">
              卖出框数 (最多 {maxBoxes} 框)
            </label>
            <input
              type="number"
              value={formData.sellBoxes}
              onChange={(e) => handleChange('sellBoxes', e.target.value)}
              max={maxBoxes}
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

          <div className="bg-orange-50 p-3 rounded-lg space-y-1">
            <p className="text-sm text-gray-600">
              总收入：<span className="font-bold text-gray-900">¥{totalIncome}</span>
            </p>
            <p className="text-sm text-gray-600">
              成本：<span className="font-bold text-gray-900">¥{cost}</span>
            </p>
            <p className="text-sm text-gray-600">
              利润：
              <span className={`font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profit >= 0 ? '+' : ''}¥{profit}
              </span>
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
