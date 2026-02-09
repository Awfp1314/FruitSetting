import { useState } from 'react';
import { MessageSquare, Calendar, ChevronRight } from 'lucide-react';

const HomePage = ({ onNavigate }) => {
  const [showMore, setShowMore] = useState(false);

  // 所有工具
  const allTools = [
    {
      id: 'market-calendar',
      name: '赶集日历',
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'fruit-promo',
      name: '促销文案',
      icon: MessageSquare,
      color: 'from-orange-500 to-red-500',
    },
    // 可以继续添加更多工具
  ];

  // 最近使用（从 localStorage 读取）
  const getRecentTools = () => {
    const recent = localStorage.getItem('recentTools');
    if (!recent) return [];
    const ids = JSON.parse(recent);
    return ids.map((id) => allTools.find((t) => t.id === id)).filter(Boolean);
  };

  const [recentTools] = useState(getRecentTools());

  // 记录工具使用
  const handleToolClick = (toolId) => {
    // 更新最近使用
    const recent = getRecentTools().map((t) => t.id);
    const newRecent = [toolId, ...recent.filter((id) => id !== toolId)].slice(0, 5);
    localStorage.setItem('recentTools', JSON.stringify(newRecent));

    onNavigate(toolId);
  };

  const displayTools = showMore ? allTools : allTools.slice(0, 5);

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
          {/* 最近使用 */}
          {recentTools.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-700">最近使用</h2>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {recentTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => handleToolClick(tool.id)}
                      className="flex flex-col items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all active:scale-95"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-md`}
                      >
                        <Icon size={24} className="text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                        {tool.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 工具 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-700">工具</h2>
              {allTools.length > 5 && (
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:underline"
                >
                  {showMore ? '收起' : '更多'}
                  <ChevronRight
                    size={14}
                    className={`transition-transform ${showMore ? 'rotate-90' : ''}`}
                  />
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {displayTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleToolClick(tool.id)}
                    className="flex flex-col items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all active:scale-95"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-md`}
                    >
                      <Icon size={24} className="text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                      {tool.name}
                    </span>
                  </button>
                );
              })}
            </div>
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
