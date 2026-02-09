import { MessageSquare, ArrowRight } from 'lucide-react';

const HomePage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans text-slate-900">
      {/* 顶部状态栏 */}
      <div className="px-4 py-2 text-xs flex justify-between items-center bg-[#1e293b] text-white border-b shadow-sm">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </div>
          <span className="font-medium tracking-wide">服务器连接正常</span>
        </div>
        <div className="flex items-center gap-2 font-mono px-2 py-0.5 rounded bg-black/20 text-gray-400">
          <span>在线运行</span>
        </div>
      </div>

      {/* 头部 */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-5 pt-5 pb-4">
          <h1 className="text-2xl font-black text-gray-900 leading-none mb-1">老王工具箱</h1>
          <p className="text-xs text-gray-400 font-mono italic">V2.0 Pro | 实用工具集</p>
        </div>
      </div>

      {/* 主内容 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* 欢迎卡片 */}
          <div className="bg-white border border-gray-200 shadow-sm p-5 rounded-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-2">👋 欢迎使用</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              专为小生意人打造的实用工具集，简单好用，随时随地提升工作效率。
            </p>
          </div>

          {/* 工具列表 */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
            <div className="border-b border-gray-200 px-5 py-3 bg-gray-50">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">可用工具</h3>
            </div>

            <button
              onClick={() => onNavigate('fruit-promo')}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors active:bg-gray-100 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-orange-500 flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <h4 className="text-base font-bold text-gray-900 mb-1">水果促销群文案</h4>
                  <p className="text-xs text-gray-500">快速生成赶集通知、价格信息和抽奖贺信</p>
                </div>
              </div>
              <ArrowRight size={20} className="text-gray-400 flex-shrink-0" />
            </button>
          </div>

          {/* 提示信息 */}
          <div className="bg-white border border-gray-200 shadow-sm p-4 rounded-sm">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              💡 所有数据保存在本地，支持离线使用
            </p>
          </div>
        </div>
      </div>

      {/* 底部 */}
      <div className="bg-white border-t border-gray-200 py-3 text-center">
        <p className="text-xs text-gray-400">© 2026 老王工具箱 · 让小生意更轻松</p>
      </div>
    </div>
  );
};

export default HomePage;
