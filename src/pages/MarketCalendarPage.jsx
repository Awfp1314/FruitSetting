import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, ArrowLeft, Settings } from 'lucide-react';
import StatusBar from '../components/StatusBar';
import MarketEditor from '../components/MarketEditor';
import AIAnalysisButton from '../components/AIAnalysisButton';
import { getLunarInfo, getNextDaysLunar } from '../utils/lunar';
import { useMarketData } from '../hooks/useMarketData';

const MarketCalendarPage = ({ onBack }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [latency, setLatency] = useState(24);
  const [todayInfo, setTodayInfo] = useState(null);
  const [nextDays, setNextDays] = useState([]);
  const [showEditor, setShowEditor] = useState(false);

  const { markets, addMarket, updateMarket, deleteMarket, resetToDefault } = useMarketData();

  const getMarketsForDay = (lunarDay) => {
    const day = lunarDay % 10;
    return markets.filter((market) => market.days.includes(day));
  };

  useEffect(() => {
    const updateTime = () => {
      const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
      setCurrentTime(time);
      if (window.navigator.onLine) {
        setLatency(Math.floor(Math.random() * (45 - 20) + 20));
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    const handleNet = () => setIsOnline(window.navigator.onLine);
    window.addEventListener('online', handleNet);
    window.addEventListener('offline', handleNet);

    // 获取农历信息
    setTodayInfo(getLunarInfo());
    setNextDays(getNextDaysLunar(7));

    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleNet);
      window.removeEventListener('offline', handleNet);
    };
  }, []);

  if (!todayInfo) return null;

  const todayMarkets = getMarketsForDay(todayInfo.lunarDay);

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans text-slate-900">
      <StatusBar isOnline={isOnline} latency={latency} />

      {/* 头部 */}
      <div className="bg-white sticky top-[34px] z-40 border-b border-gray-200 shadow-sm">
        <div className="px-5 pt-5 pb-4 flex justify-between items-end">
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                onBack();
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
              type="button"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900 leading-none mb-1">赶集日历</h1>
              <p className="text-xs text-gray-400 font-mono italic">正宁县 | {currentTime}</p>
            </div>
          </div>

          <button
            onClick={() => setShowEditor(true)}
            className="bg-gray-900 text-white px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
          >
            <Settings size={14} />
            管理
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-10">
        {/* 今天有集的地方 - 最突出 */}
        {todayMarkets.length > 0 ? (
          <div className="bg-gradient-to-br from-orange-500 to-red-500 shadow-lg p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={24} className="text-white" />
              <h2 className="text-xl font-black text-white">今天有集！</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {todayMarkets.map((market, index) => (
                <div
                  key={index}
                  className="bg-white/20 backdrop-blur-sm text-white px-5 py-3 rounded-lg text-lg font-bold shadow-md border border-white/30"
                >
                  {market.name}
                </div>
              ))}
            </div>
            <p className="text-white/80 text-sm mt-4">💡 今天可以去这些地方摆摊赶集</p>
          </div>
        ) : (
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
            <p className="text-lg font-bold text-gray-500 mb-2">今天没有集市</p>
            <p className="text-sm text-gray-400">休息一天，准备明天的货</p>
          </div>
        )}

        {/* 今天日期信息 */}
        <div className="bg-white border border-gray-200 shadow-sm p-5 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={18} className="text-blue-600" />
            <h3 className="text-sm font-bold text-gray-700">今天日期</h3>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-gray-900">农历 {todayInfo.lunarDateStr}</span>
            <span className="text-sm text-gray-500">星期{todayInfo.weekDay}</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {todayInfo.solarDate.toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* 未来7天 */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
          <div className="border-b border-gray-200 px-5 py-3 bg-gray-50">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">未来集市</h3>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {nextDays.map((day, index) => {
              const markets = getMarketsForDay(day.lunarDay);
              const isToday = index === 0;

              return (
                <div
                  key={index}
                  className={`p-4 ${isToday ? 'bg-orange-50' : 'hover:bg-gray-50'} transition-colors`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-base font-bold ${
                            isToday ? 'text-orange-600' : 'text-gray-900'
                          }`}
                        >
                          {day.lunarDateStr}
                        </span>
                        {isToday && (
                          <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                            今天
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {day.solarDate.toLocaleDateString('zh-CN', {
                          month: 'numeric',
                          day: 'numeric',
                        })}{' '}
                        星期{day.weekDay}
                      </p>
                    </div>
                  </div>

                  {markets.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {markets.map((market, idx) => (
                        <span
                          key={idx}
                          className={`${market.color} text-white px-2 py-1 rounded text-xs font-bold`}
                        >
                          {market.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">无集市</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 说明 */}
        <div className="bg-white border border-gray-200 shadow-sm p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              赶集规律（农历尾数）
            </h3>
            <button
              onClick={() => setShowEditor(true)}
              className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
            >
              <Settings size={12} />
              编辑
            </button>
          </div>
          <div className="space-y-2 text-xs text-gray-600 leading-relaxed">
            {markets.map((market, index) => (
              <p key={index}>
                • {market.name}：逢 {market.days.join('、')}
              </p>
            ))}
            {markets.length === 0 && (
              <p className="text-gray-400 italic">暂无数据，点击右上角"管理"添加</p>
            )}
          </div>
        </div>
      </div>

      {/* 编辑器弹窗 */}
      {showEditor && (
        <MarketEditor
          markets={markets}
          onAdd={addMarket}
          onUpdate={updateMarket}
          onDelete={deleteMarket}
          onReset={resetToDefault}
          onClose={() => setShowEditor(false)}
        />
      )}

      {/* AI 分析按钮 */}
      <AIAnalysisButton markets={todayMarkets} todayInfo={todayInfo} />
    </div>
  );
};

export default MarketCalendarPage;
