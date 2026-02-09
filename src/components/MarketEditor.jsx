import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check, RotateCcw } from 'lucide-react';

const COLORS = [
  { value: 'bg-blue-500', label: '蓝色' },
  { value: 'bg-orange-500', label: '橙色' },
  { value: 'bg-green-500', label: '绿色' },
  { value: 'bg-red-500', label: '红色' },
  { value: 'bg-purple-500', label: '紫色' },
  { value: 'bg-indigo-500', label: '靛蓝' },
  { value: 'bg-teal-500', label: '青色' },
  { value: 'bg-pink-500', label: '粉色' },
  { value: 'bg-yellow-500', label: '黄色' },
];

const MarketEditor = ({ markets, onAdd, onUpdate, onDelete, onReset, onClose }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    days: [],
    color: 'bg-blue-500',
  });

  const handleEdit = (index) => {
    setEditingIndex(index);
    setFormData(markets[index]);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingIndex(null);
    setFormData({
      name: '',
      shortName: '',
      days: [],
      color: 'bg-blue-500',
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.shortName || formData.days.length === 0) {
      alert('请填写完整信息');
      return;
    }

    if (isAdding) {
      onAdd(formData);
    } else if (editingIndex !== null) {
      onUpdate(editingIndex, formData);
    }

    setIsAdding(false);
    setEditingIndex(null);
    setFormData({ name: '', shortName: '', days: [], color: 'bg-blue-500' });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setFormData({ name: '', shortName: '', days: [], color: 'bg-blue-500' });
  };

  const toggleDay = (day) => {
    const newDays = formData.days.includes(day)
      ? formData.days.filter((d) => d !== day)
      : [...formData.days, day].sort((a, b) => a - b);
    setFormData({ ...formData, days: newDays });
  };

  const handleReset = () => {
    if (confirm('确定要恢复默认数据吗？这将清除所有自定义修改。')) {
      onReset();
      handleCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">管理赶集规律</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* 添加/编辑表单 */}
          {(isAdding || editingIndex !== null) && (
            <div className="bg-orange-50 border-2 border-orange-500 rounded-lg p-4 space-y-3">
              <h3 className="text-sm font-bold text-orange-700">
                {isAdding ? '添加新乡镇' : '编辑乡镇'}
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 font-bold block mb-1">全称</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="如：榆林子镇"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 font-bold block mb-1">简称</label>
                  <input
                    type="text"
                    value={formData.shortName}
                    onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                    placeholder="如：榆林子"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-600 font-bold block mb-2">
                  赶集日期（农历尾数）
                </label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`w-10 h-10 rounded font-bold text-sm transition-all ${
                        formData.days.includes(day)
                          ? 'bg-orange-500 text-white scale-110'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-600 font-bold block mb-2">颜色</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`px-3 py-2 rounded text-xs font-bold text-white ${color.value} ${
                        formData.color === color.value ? 'ring-2 ring-gray-900 ring-offset-2' : ''
                      }`}
                    >
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-orange-500 text-white px-4 py-2 rounded font-bold text-sm flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
                >
                  <Check size={16} />
                  保存
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors"
                >
                  <X size={16} />
                  取消
                </button>
              </div>
            </div>
          )}

          {/* 列表 */}
          <div className="space-y-2">
            {markets.map((market, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-3 h-3 rounded-full ${market.color}`}></div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 text-sm">{market.name}</div>
                    <div className="text-xs text-gray-500">逢 {market.days.join('、')} 有集</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(index)}
                    className="p-2 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Edit2 size={16} className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`确定要删除 ${market.name} 吗？`)) {
                        onDelete(index);
                      }
                    }}
                    className="p-2 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 底部操作 */}
        <div className="px-5 py-4 border-t border-gray-200 flex gap-2">
          <button
            onClick={handleAdd}
            disabled={isAdding || editingIndex !== null}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            添加乡镇
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors"
          >
            <RotateCcw size={16} />
            恢复默认
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketEditor;
