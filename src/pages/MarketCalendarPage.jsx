import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, ArrowLeft } from 'lucide-react';
import StatusBar from '../components/StatusBar';
import { getLunarInfo, getNextDaysLunar } from '../utils/lunar';
import { getMarketsForDay } from '../constants/marketData';

const MarketCalendarPage = ({ onBack }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [latency, setLatency] = useState(24);
  const [todayInfo, setTodayInfo] = useState(null);
  const [nextDays, setNextDays] = useState([]);

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
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-10">
        {/* 今日信息 */}
        <div className="bg-white border-t-4 border-orange-500 shadow-sm p-5 rounded-sm">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={20} className="text-orange-600" />
            <h2 className="text-lg font-bold text-gray-900">今天</h2>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-sm p-4 mb-4">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-3xl font-black text-orange-600">
                农历 {todayInfo.lunarDateStr}
              </span>
              <span className="text-sm text-gray-500">星期{todayInfo.weekDay}</span>
            </div>
            <p className="text-xs text-gray-500">
              {todayInfo.solarDate.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {todayMarkets.length > 0 ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-green-600" />
                <h3 className="text-sm font-bold text-gray-700">今天有集的地方</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {todayMarkets.map((market, index) => (
                  <div
                    key={index}
                    className={`${market.color} text-white px-4 py-2 rounded-full text-sm font-bold shadow-sm`}
                  >
                    {market.name}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-sm p-4 text-center">
              <p className="text-sm text-gray-500">今天没有集市</p>
            </div>
          )}
        </div>

        {/* 未来7天 */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
          <div className="border-b border-gray-200 px-5 py-3 bg-gray-50">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">未来7天</h3>
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
                          className={`text-base font-bold ${isToday ? 'text-orange-600' : 'text-gray-900'}`}
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
        <div className="bg-white border border-gray-200 shadow-sm p-4 rounded-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            赶集规律
          </h3>
          <div className="space-y-2 text-xs text-gray-600 leading-relaxed">
            <p>• 县城、周家：逢农历 1、5、8</p>
            <p>• 榆林子：逢农历 2、6、9</p>
            <p>• 宫河、永正：逢农历 3、7、10</p>
            <p>• 揪头：逢农历 3、6、9</p>
            <p>• 永和：逢农历 4、7、10</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketCalendarPage;
