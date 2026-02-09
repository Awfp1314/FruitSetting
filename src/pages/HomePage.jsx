import { useState, useEffect } from 'react';
import { MessageSquare, Calendar, BookOpen, TrendingUp, Package, DollarSign } from 'lucide-react';
import { CURRENT_VERSION } from '../constants/changelog';
import { dataManager } from '../utils/dataManager';

const HomePage = ({ onNavigate }) => {
  const [accountStats, setAccountStats] = useState(null);

  useEffect(() => {
    // 加载记账数据统计
    const data = dataManager.load();
    const { inventory = [], sales = [] } = data;

    // 计算统计数据
    const activeInventory = inventory.filter(
      (inv) => inv.status === 'active' && inv.remainBoxes > 0
    );
    const totalStock = activeInventory.reduce((sum, inv) => sum + inv.remainBoxes, 0);

    // 最近7天销售
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentSales = sales.filter((s) => new Date(s.date) >= sevenDaysAgo);

    const weekIncome = recentSales.reduce((sum, s) => sum + (s.totalIncome || 0), 0);
    const weekProfit = recentSales.reduce((sum, s) => sum + (s.profit || 0), 0);

    // 今天销售
    const today = new Date().toISOString().split('T')[0];
    const todaySales = sales.filter((s) => s.date === today);
    const todayProfit = todaySales.reduce((sum, s) => sum + (s.profit || 0), 0);

    setAccountStats({
      totalStock,
      activeInventoryCount: activeInventory.length,
      weekIncome,
      weekProfit,
      todayProfit,
      hasSales: sales.length > 0,
    });
  }, []);
  // 所有工具
  const allTools = [
    {
      id: 'market-calendar',
      name: '赶集日历',
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'account',
      name: '记账本',
      icon: BookOpen,
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'fruit-promo',
      name: '促销文案',
      icon: MessageSquare,
      color: 'from-orange-500 to-red-500',
    },
    // 可以继续添加更多工具
  ];

  // 最近使用（从 localStorage 读取，最多5个）
  const getRecentTools = () => {
    const recent = localStorage.getItem('recentTools');
    if (!recent) return [];
    const ids = JSON.parse(recent);
    return ids
      .slice(0, 5)
      .map((id) => allTools.find((t) => t.id === id))
      .filter(Boolean);
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

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans text-slate-900 pb-16">
      {/* 顶部搜索栏 */}
      <div className="bg-gradient-to-br from-blue-500 to-cyan-500 px-4 pt-3 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-white/90 backdrop-blur rounded-full px-4 py-2 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="text-sm text-gray-400">搜索工具</span>
          </div>
          <div className="text-white text-xs">v{CURRENT_VERSION}</div>
        </div>
      </div>

      {/* 主内容 */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="max-w-2xl mx-auto">
          {/* 快捷功能区 */}
          <div className="bg-white px-4 py-4 -mt-2 rounded-t-2xl">
            <div className="grid grid-cols-4 gap-4">
              {allTools.slice(0, 4).map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleToolClick(tool.id)}
                    className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
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

          {/* 数据仪表盘 */}
          {accountStats && accountStats.hasSales && (
            <div className="mx-4 mt-3">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg p-5 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold">生意概况</h2>
                  <button
                    onClick={() => onNavigate('account')}
                    className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
                  >
                    查看详情
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {/* 今日利润 */}
                  <div className="bg-white/10 rounded-lg p-2.5">
                    <div className="flex items-center gap-0.5 mb-1.5 opacity-90">
                      <TrendingUp size={12} />
                      <span className="text-[10px] leading-tight">今日利润</span>
                    </div>
                    <p className="text-base font-black leading-tight">
                      {accountStats.todayProfit >= 0 ? '+' : ''}¥{accountStats.todayProfit}
                    </p>
                  </div>

                  {/* 本周收入 */}
                  <div className="bg-white/10 rounded-lg p-2.5">
                    <div className="flex items-center gap-0.5 mb-1.5 opacity-90">
                      <DollarSign size={12} />
                      <span className="text-[10px] leading-tight">本周收入</span>
                    </div>
                    <p className="text-base font-black leading-tight">¥{accountStats.weekIncome}</p>
                  </div>

                  {/* 库存 */}
                  <div className="bg-white/10 rounded-lg p-2.5">
                    <div className="flex items-center gap-0.5 mb-1.5 opacity-90">
                      <Package size={12} />
                      <span className="text-[10px] leading-tight whitespace-nowrap">剩余库存</span>
                    </div>
                    <p className="text-base font-black leading-tight">
                      {accountStats.totalStock}框
                    </p>
                  </div>
                </div>

                {/* 本周利润 */}
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="flex justify-between items-center">
                    <span className="text-xs opacity-90">本周利润</span>
                    <span className="text-xl font-black">
                      {accountStats.weekProfit >= 0 ? '+' : ''}¥{accountStats.weekProfit}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 常用应用 */}
          <div className="bg-white mx-4 mt-3 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                <h2 className="text-sm font-bold text-gray-800">常用</h2>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {allTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleToolClick(tool.id)}
                    className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
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

          {/* 提示信息卡片 */}
          <div className="bg-white mx-4 mt-3 rounded-xl p-4 border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-800 mb-1">本地存储</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  所有数据保存在本地，支持离线使用，保护您的隐私
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
