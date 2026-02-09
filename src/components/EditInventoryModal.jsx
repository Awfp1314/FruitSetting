import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useToast } from './Toast';

const EditInventoryModal = ({ inventory, hasSales, onSave, onClose }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    fruit: inventory.fruit,
    boxes: inventory.boxes,
    pricePerBox: inventory.pricePerBox,
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

  const boxes = parseFloat(formData.boxes) || 0;
  const pricePerBox = parseFloat(formData.pricePerBox) || 0;
  const totalCost = boxes * pricePerBox;

  // 计算新的剩余框数
  const soldBoxes = inventory.boxes - inventory.remainBoxes;
  const newRemainBoxes = boxes - soldBoxes;

  const handleSave = () => {
    if (boxes < soldBoxes) {
      showToast(`总框数不能少于已售出的 ${soldBoxes} 框`, 'error');
      return;
    }

    const updates = {
      fruit: formData.fruit,
      boxes,
      pricePerBox,
      totalCost,
      remainBoxes: newRemainBoxes,
      status: newRemainBoxes <= 0 ? 'finished' : 'active',
    };
    onSave(updates);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-500 to-cyan-500">
          <h3 className="text-lg font-bold text-white">编辑进货记录</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded transition-colors">
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <p className="text-gray-600">{inventory.date} 进货</p>
            <p className="text-gray-500 text-xs mt-1">
              {inventory.boxes} 框 · 剩余 {inventory.remainBoxes} 框
            </p>
          </div>

          <div>
            <label className="text-xs text-gray-600 font-bold block mb-2">水果种类</label>
            <input
              type="text"
              value={formData.fruit}
              onChange={(e) => handleChange('fruit', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 font-bold block mb-2">
              总框数 (至少 {soldBoxes} 框)
            </label>
            <input
              type="number"
              value={formData.boxes}
              onChange={(e) => handleChange('boxes', e.target.value)}
              min={soldBoxes}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 font-bold block mb-2">单价(元/框)</label>
            <input
              type="number"
              value={formData.pricePerBox}
              onChange={(e) => handleChange('pricePerBox', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
            />
          </div>

          <div className="bg-blue-50 p-3 rounded-lg space-y-1">
            <p className="text-sm text-gray-600">
              总成本：<span className="font-bold text-gray-900">¥{totalCost}</span>
            </p>
            <p className="text-sm text-gray-600">
              剩余框数：<span className="font-bold text-gray-900">{newRemainBoxes} 框</span>
            </p>
          </div>

          {hasSales && (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <p className="text-xs text-yellow-700">
                ⚠️ 注意：修改单价会影响已有销售记录的利润计算
              </p>
            </div>
          )}
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
            className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-600"
          >
            <Save size={16} />
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditInventoryModal;
