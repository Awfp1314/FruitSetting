import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Calendar,
  BookOpen,
  TrendingUp,
  Package,
  DollarSign,
  Bot,
} from 'lucide-react';
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
    {
      id: 'ai-chat',
      name: 'AI助手',
      icon: Bot,
      color: 'from-purple-500 to-pink-500',
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
      <div className="bg-white border-b border-gray-200 shadow-sm safe-area-top">
        <div className="px-5 pt-5 pb-4">
          <h1 className="text-2xl font-black text-gray-900 leading-none mb-1">小王工具箱</h1>
          <p className="text-xs text-gray-400 font-mono italic">v{CURRENT_VERSION} | 实用工具集</p>
        </div>
      </div>

      {/* 主内容 */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="max-w-2xl mx-auto">
          {/* 数据仪表盘 */}
          {accountStats && accountStats.hasSales && (
            <div className="mx-4 mt-4">
              <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 rounded-2xl shadow-xl p-5 text-white relative overflow-hidden">
                {/* 装饰性背景 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={18} className="opacity-90" />
                      <h2 className="text-base font-bold">生意概况</h2>
                    </div>
                    <button
                      onClick={() => onNavigate('account')}
                      className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors backdrop-blur-sm"
                    >
                      查看详情
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {/* 今日利润 */}
                    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2.5 border border-white/10">
                      <div className="flex items-center gap-0.5 mb-1 opacity-90">
                        <TrendingUp size={12} />
                        <span className="text-[10px] whitespace-nowrap">今日利润</span>
                      </div>
                      <p className="text-[15px] font-black leading-tight">
                        {accountStats.todayProfit >= 0 ? '+' : ''}¥{accountStats.todayProfit}
                      </p>
                    </div>

                    {/* 本周收入 */}
                    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2.5 border border-white/10">
                      <div className="flex items-center gap-0.5 mb-1 opacity-90">
                        <DollarSign size={12} />
                        <span className="text-[10px] whitespace-nowrap">本周收入</span>
                      </div>
                      <p className="text-[15px] font-black leading-tight">
                        ¥{accountStats.weekIncome}
                      </p>
                    </div>

                    {/* 库存 */}
                    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2.5 border border-white/10">
                      <div className="flex items-center gap-0.5 mb-1 opacity-90">
                        <Package size={12} />
                        <span className="text-[10px] whitespace-nowrap">剩余库存</span>
                      </div>
                      <p className="text-[15px] font-black leading-tight">
                        {accountStats.totalStock}框
                      </p>
                    </div>
                  </div>

                  {/* 本周利润 - 突出显示 */}
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium opacity-90">本周利润</span>
                      <span className="text-xl font-black">
                        {accountStats.weekProfit >= 0 ? '+' : ''}¥{accountStats.weekProfit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 常用工具 */}
          <div className="bg-white mx-4 mt-3 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                <h2 className="text-sm font-bold text-gray-800">常用工具</h2>
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

          {/* 所有工具 */}
          <div className="bg-white mx-4 mt-3 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
                <h2 className="text-sm font-bold text-gray-800">所有工具</h2>
              </div>
            </div>
            <div className="space-y-2">
              {allTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleToolClick(tool.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 active:scale-[0.98] transition-all"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-sm`}
                    >
                      <Icon size={20} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">{tool.name}</span>
                    <svg
                      className="w-4 h-4 text-gray-400 ml-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
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
