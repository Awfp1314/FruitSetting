import { useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowLeft, Settings } from 'lucide-react';
import MarketEditor from '../components/MarketEditor';
import AIAnalysisButton from '../components/AIAnalysisButton';
import { getLunarInfo, getNextDaysLunar } from '../utils/lunar';
import { useMarketData } from '../hooks/useMarketData';

const MarketCalendarPage = ({ onBack }) => {
  const [todayInfo, setTodayInfo] = useState(null);
  const [nextDays, setNextDays] = useState([]);
  const [showEditor, setShowEditor] = useState(false);

  const { markets, addMarket, updateMarket, deleteMarket, resetToDefault } = useMarketData();

  const getMarketsForDay = (lunarDay) => {
    const day = lunarDay % 10;
    return markets.filter((market) => market.days.includes(day));
  };

  useEffect(() => {
    setTodayInfo(getLunarInfo());
    setNextDays(getNextDaysLunar(10));
  }, []);

  if (!todayInfo) return null;

  const todayMarkets = getMarketsForDay(todayInfo.lunarDay);

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans text-slate-900">
      {/* 头部 */}
      <div className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="px-4 pt-4 pb-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-xl font-black text-gray-900">赶集日历</h1>
          </div>
          <button
            onClick={() => setShowEditor(true)}
            className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md active:scale-95 transition-transform"
          >
            <Settings size={14} />
            管理
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-10">
        {/* 今日日期 + 集市状态 */}
        <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 rounded-2xl shadow-lg p-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full -mr-12 -mt-12"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full -ml-8 -mb-8"></div>

          <div className="relative">
            {/* 日期信息 */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={16} className="opacity-80" />
                  <span className="text-xs opacity-80">
                    {todayInfo.solarDate.toLocaleDateString('zh-CN', {
                      month: 'long',
                      day: 'numeric',
                    })}
                    {' · '}星期{todayInfo.weekDay}
                  </span>
                </div>
                <p className="text-2xl font-black">农历{todayInfo.lunarDateStr}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] opacity-70">正宁县</p>
              </div>
            </div>

            {/* 今日集市 */}
            {todayMarkets.length > 0 ? (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <MapPin size={14} className="opacity-90" />
                  <span className="text-xs font-bold opacity-90">今天有集</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {todayMarkets.map((market, index) => (
                    <div
                      key={index}
                      className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-bold border border-white/20"
                    >
                      {market.name}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-sm font-bold opacity-90">今天没有集市</p>
                <p className="text-xs opacity-70 mt-0.5">休息一天，准备明天的货</p>
              </div>
            )}
          </div>
        </div>

        {/* 未来日程 */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-800">未来集市</h3>
          </div>

          <div>
            {nextDays.map((day, index) => {
              const dayMarkets = getMarketsForDay(day.lunarDay);
              const isToday = index === 0;
              const hasMarket = dayMarkets.length > 0;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-b-0 ${
                    isToday ? 'bg-orange-50/50' : ''
                  }`}
                >
                  {/* 日期列 */}
                  <div className="w-14 flex-shrink-0 text-center">
                    <p
                      className={`text-lg font-black leading-none ${isToday ? 'text-orange-600' : hasMarket ? 'text-gray-900' : 'text-gray-300'}`}
                    >
                      {day.solarDate.getDate()}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {['日', '一', '二', '三', '四', '五', '六'][day.solarDate.getDay()]}
                    </p>
                  </div>

                  {/* 分隔线 */}
                  <div
                    className={`w-0.5 h-10 rounded-full ${isToday ? 'bg-orange-400' : hasMarket ? 'bg-blue-400' : 'bg-gray-200'}`}
                  ></div>

                  {/* 内容列 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-xs ${isToday ? 'text-orange-600' : 'text-gray-500'}`}>
                        {day.lunarDateStr}
                      </span>
                      {isToday && (
                        <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                          今天
                        </span>
                      )}
                    </div>
                    {hasMarket ? (
                      <div className="flex flex-wrap gap-1">
                        {dayMarkets.map((market, idx) => (
                          <span
                            key={idx}
                            className={`${market.color} text-white px-2 py-0.5 rounded text-[11px] font-bold`}
                          >
                            {market.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-gray-300">无集市</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 赶集规律 */}
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-800">赶集规律</h3>
            <button
              onClick={() => setShowEditor(true)}
              className="text-xs text-blue-500 font-bold flex items-center gap-0.5"
            >
              <Settings size={11} />
              编辑
            </button>
          </div>
          <div className="space-y-2">
            {markets.map((market, index) => (
              <div key={index} className="flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full ${market.color} flex-shrink-0`}></div>
                <span className="text-xs text-gray-700 font-medium">{market.name}</span>
                <span className="text-[10px] text-gray-400 ml-auto">
                  逢 {market.days.join('、')}
                </span>
              </div>
            ))}
            {markets.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-2">
                暂无数据，点击右上角"管理"添加
              </p>
            )}
          </div>
        </div>
      </div>

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

      <AIAnalysisButton markets={todayMarkets} todayInfo={todayInfo} />
    </div>
  );
};

export default MarketCalendarPage;
