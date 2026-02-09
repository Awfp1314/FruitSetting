import { X, Sparkles } from 'lucide-react';
import { CHANGELOG, getVersionTypeName } from '../constants/changelog';

const UpdateModal = ({ version, onClose }) => {
  const updateInfo = CHANGELOG[version];

  if (!updateInfo) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={28} />
            <h2 className="text-2xl font-black">版本更新</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black">v{version}</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
              {getVersionTypeName(updateInfo.type)}
            </span>
          </div>
          <p className="text-sm opacity-90 mt-2">{updateInfo.date}</p>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{updateInfo.title}</h3>
          <div className="space-y-3">
            {updateInfo.changes.map((change, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                <p className="text-gray-700 leading-relaxed">{change}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 底部 */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold text-lg shadow-lg active:scale-98 transition-transform"
          >
            开始使用
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
