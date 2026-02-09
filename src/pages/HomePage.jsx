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
      {/* 头部 */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-5 pt-5 pb-4">
          <h1 className="text-2xl font-black text-gray-900 leading-none mb-1">老王工具箱</h1>
          <p className="text-xs text-gray-400 font-mono italic">v{CURRENT_VERSION} | 实用工具集</p>
        </div>
      </div>

      {/* 主内容 */}
      <div className="flex-1 overflow-y-auto p-4 pb-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* 数据仪表盘 */}
          {accountStats && accountStats.hasSales && (
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

              <div className="grid grid-cols-3 gap-4">
                {/* 今日利润 */}
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="flex items-center gap-1 mb-2 opacity-90">
                    <TrendingUp size={14} />
                    <span className="text-xs">今日利润</span>
                  </div>
                  <p className="text-xl font-black">
                    {accountStats.todayProfit >= 0 ? '+' : ''}¥{accountStats.todayProfit}
                  </p>
                </div>

                {/* 本周收入 */}
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="flex items-center gap-1 mb-2 opacity-90">
                    <DollarSign size={14} />
                    <span className="text-xs">本周收入</span>
                  </div>
                  <p className="text-xl font-black">¥{accountStats.weekIncome}</p>
                </div>

                {/* 库存 */}
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="flex items-center gap-1 mb-2 opacity-90">
                    <Package size={14} />
                    <span className="text-xs">剩余库存</span>
                  </div>
                  <p className="text-xl font-black">{accountStats.totalStock} 框</p>
                </div>
              </div>

              {/* 本周利润 */}
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">本周利润</span>
                  <span className="text-2xl font-black">
                    {accountStats.weekProfit >= 0 ? '+' : ''}¥{accountStats.weekProfit}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 最近使用 */}
          {recentTools.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-700">最近使用</h2>
              </div>
              <div className="grid grid-cols-5 gap-3">
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

          {/* 所有工具 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-700">所有工具</h2>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {allTools.map((tool) => {
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
