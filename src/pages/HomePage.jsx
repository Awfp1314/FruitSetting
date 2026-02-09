import { MessageSquare, ArrowRight, Calendar, Sparkles } from 'lucide-react';

const HomePage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans text-slate-900 pb-16">
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
          <p className="text-xs text-gray-400 font-mono italic">V2.0 | 实用工具集</p>
        </div>
      </div>

      {/* 主内容 */}
      <div className="flex-1 overflow-y-auto p-4 pb-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* 欢迎卡片 */}
          <div className="bg-gradient-to-br from-orange-500 to-red-500 border border-orange-600 shadow-lg p-6 rounded-lg text-white">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={24} className="animate-pulse" />
              <h2 className="text-xl font-black">欢迎使用</h2>
            </div>
            <p className="text-sm leading-relaxed opacity-90">
              老王工具箱，专为小生意人打造。简单好用，随时随地提升工作效率。
            </p>
          </div>

          {/* 快捷入口 */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
            <div className="border-b border-gray-200 px-5 py-3 bg-gray-50">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">快捷入口</h3>
            </div>

            <button
              onClick={() => onNavigate('tools')}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors active:bg-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <Calendar size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <h4 className="text-base font-bold text-gray-900 mb-1">查看所有工具</h4>
                  <p className="text-xs text-gray-500">赶集日历、促销文案等更多工具</p>
                </div>
              </div>
              <ArrowRight size={20} className="text-gray-400 flex-shrink-0" />
            </button>
          </div>

          {/* 提示信息 */}
          <div className="bg-white border border-gray-200 shadow-sm p-4 rounded-lg">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              💡 所有数据保存在本地，支持离线使用
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
