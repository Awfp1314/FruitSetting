import { Sparkles, MessageSquare, TrendingUp, Zap, ArrowRight } from 'lucide-react';

const HomePage = ({ onNavigate }) => {
  const tools = [
    {
      id: 'fruit-promo',
      title: '水果促销群文案',
      description: '快速生成赶集通知、价格信息和抽奖贺信',
      icon: MessageSquare,
      color: 'from-orange-500 to-red-500',
      badge: '热门',
      badgeColor: 'bg-red-500'
    },
    {
      id: 'coming-soon-1',
      title: '客户管理系统',
      description: '即将上线，敬请期待',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
      badge: '即将上线',
      badgeColor: 'bg-blue-500',
      disabled: true
    },
    {
      id: 'coming-soon-2',
      title: '库存统计工具',
      description: '即将上线，敬请期待',
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      badge: '即将上线',
      badgeColor: 'bg-purple-500',
      disabled: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-50">
      {/* 顶部装饰 */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-orange-500/10 to-transparent pointer-events-none" />
      
      <div className="relative max-w-6xl mx-auto px-4 py-12 sm:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-sm">
            <Sparkles size={16} className="animate-pulse" />
            老王的工具箱
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-black text-gray-900 mb-6 leading-tight">
            让生意更简单
            <br />
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              效率翻倍
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            专为小生意人打造的实用工具集，简单好用，随时随地提升工作效率
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                  tool.disabled ? 'opacity-60' : 'hover:-translate-y-2 cursor-pointer'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => !tool.disabled && onNavigate(tool.id)}
              >
                {/* 渐变背景 */}
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${tool.color}`} />
                
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`${tool.badgeColor} text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm`}>
                    {tool.badge}
                  </span>
                </div>

                <div className="p-6 pt-8">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon size={28} className="text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {tool.description}
                  </p>

                  {/* Action */}
                  {!tool.disabled && (
                    <div className="flex items-center gap-2 text-orange-600 font-bold text-sm group-hover:gap-3 transition-all">
                      立即使用
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </div>

                {/* Hover Effect */}
                {!tool.disabled && (
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '400ms' }}>
          <div className="inline-flex items-center gap-6 bg-white px-6 py-4 rounded-full shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">在线运行</span>
            </div>
            <div className="w-px h-4 bg-gray-300" />
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-orange-500" />
              <span className="text-sm text-gray-600">免费使用</span>
            </div>
            <div className="w-px h-4 bg-gray-300" />
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-orange-500" />
              <span className="text-sm text-gray-600">持续更新</span>
            </div>
          </div>
          
          <p className="text-xs text-gray-400">
            © 2026 老王工具箱 · 让小生意更轻松
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
