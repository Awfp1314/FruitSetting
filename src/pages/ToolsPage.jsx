import { MessageSquare, Calendar, ArrowRight } from 'lucide-react';
import StatusBar from '../components/StatusBar';

const ToolsPage = ({ onNavigate }) => {
  const tools = [
    {
      id: 'market-calendar',
      name: '赶集日历',
      description: '查看今天和未来哪些地方有集',
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      id: 'fruit-promo',
      name: '水果促销群文案',
      description: '快速生成赶集通知、价格信息和抽奖贺信',
      icon: MessageSquare,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="bg-[#F0F2F5] font-sans text-slate-900 pb-16">
      <StatusBar isOnline={true} latency={24} />

      {/* 头部 */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-5 pt-5 pb-4">
          <h1 className="text-2xl font-black text-gray-900 leading-none mb-1">工具箱</h1>
          <p className="text-xs text-gray-400 font-mono italic">选择一个工具开始使用</p>
        </div>
      </div>

      {/* 工具列表 */}
      <div className="p-4">
        <div className="max-w-2xl mx-auto space-y-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => onNavigate(tool.id)}
                className="w-full bg-white border border-gray-200 shadow-sm rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-all active:scale-98"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-bold text-gray-900 mb-1">{tool.name}</h3>
                    <p className="text-xs text-gray-500">{tool.description}</p>
                  </div>
                </div>
                <ArrowRight size={20} className="text-gray-400 flex-shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
