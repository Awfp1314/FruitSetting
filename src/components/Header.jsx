import { Download, Edit3, MessageSquare, ArrowLeft } from 'lucide-react';

const Header = ({ 
  currentTime, 
  isAppMode, 
  installPrompt, 
  onInstall, 
  activeTab, 
  onTabChange,
  showBackButton,
  onBack
}) => (
  <div className="bg-white sticky top-[34px] z-40 border-b border-gray-200 shadow-sm">
    <div className="px-5 pt-5 pb-4 flex justify-between items-end">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-black text-gray-900 leading-none mb-1">
            老王水果摊配置
          </h1>
          <p className="text-xs text-gray-400 font-mono italic">
            V4.7 Pro | {currentTime}
          </p>
        </div>
      </div>
      
      {!isAppMode && (
        <button 
          onClick={onInstall}
          className="bg-gray-900 text-white px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-transform animate-in fade-in slide-in-from-right-4"
        >
          <Download size={14} />
          {installPrompt ? '安装APP' : '添加至桌面'}
        </button>
      )}
    </div>

    <div className="flex border-t border-gray-200 font-bold text-sm">
      <button 
        onClick={() => onTabChange('config')} 
        className={`flex-1 py-3 flex items-center justify-center gap-2 transition-colors ${
          activeTab === 'config' 
            ? 'bg-gray-100 border-b-2 border-gray-900 text-gray-900' 
            : 'text-gray-400'
        }`}
      >
        <Edit3 size={16} /> 编辑
      </button>
      <button 
        onClick={() => onTabChange('preview')} 
        className={`flex-1 py-3 flex items-center justify-center gap-2 transition-colors ${
          activeTab === 'preview' 
            ? 'bg-gray-100 border-b-2 border-gray-900 text-gray-900' 
            : 'text-gray-400'
        }`}
      >
        <MessageSquare size={16} /> 预览
      </button>
    </div>
  </div>
);

export default Header;
