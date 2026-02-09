import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { streamAI } from '../utils/ai';
import { dataManager } from '../utils/dataManager';
import { getLunarInfo } from '../utils/lunar';

const AIAnalysisButton = ({ markets, todayInfo }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  // 禁止背景滚动
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  // 获取明天的集市信息
  const getTomorrowMarkets = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowLunar = getLunarInfo(tomorrow);
    const tomorrowDay = tomorrowLunar.lunarDay % 10;

    const savedMarkets = localStorage.getItem('marketSchedule');
    const allMarkets = savedMarkets ? JSON.parse(savedMarkets) : [];
    const tomorrowMarkets = allMarkets.filter((m) => m.days.includes(tomorrowDay));

    return { tomorrowLunar, tomorrowMarkets };
  };

  const handleAnalyze = async () => {
    setShowModal(true);
    setLoading(true);
    setResult('');

    // 获取记账数据
    const accountData = dataManager.load();
    const { inventory = [], sales = [] } = accountData;

    // 活跃库存
    const activeInventory = inventory.filter(
      (inv) => inv.status === 'active' && inv.remainBoxes > 0
    );

    // 最近7天销售
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentSales = sales.filter((s) => new Date(s.date) >= sevenDaysAgo);

    // 按地点统计
    const salesByLocation = {};
    recentSales.forEach((sale) => {
      if (!salesByLocation[sale.location]) {
        salesByLocation[sale.location] = { count: 0, income: 0, profit: 0, boxes: 0 };
      }
      salesByLocation[sale.location].count++;
      salesByLocation[sale.location].income += sale.totalIncome || 0;
      salesByLocation[sale.location].profit += sale.profit || 0;
      salesByLocation[sale.location].boxes += sale.sellBoxes || 0;
    });

    // 按日期统计
    const salesByDate = {};
    recentSales.forEach((sale) => {
      if (!salesByDate[sale.date]) {
        salesByDate[sale.date] = { income: 0, profit: 0, boxes: 0 };
      }
      salesByDate[sale.date].income += sale.totalIncome || 0;
      salesByDate[sale.date].profit += sale.profit || 0;
      salesByDate[sale.date].boxes += sale.sellBoxes || 0;
    });

    // 总利润
    const totalProfit7d = recentSales.reduce((sum, s) => sum + (s.profit || 0), 0);
    const totalIncome7d = recentSales.reduce((sum, s) => sum + (s.totalIncome || 0), 0);
    const totalBoxes7d = recentSales.reduce((sum, s) => sum + (s.sellBoxes || 0), 0);

    // 明天集市
    const { tomorrowLunar, tomorrowMarkets } = getTomorrowMarkets();

    // 构建提示词
    const todayMarketNames = markets.map((m) => m.name).join('、');
    const tomorrowMarketNames = tomorrowMarkets.map((m) => m.name).join('、');

    let inventoryInfo = '';
    if (activeInventory.length > 0) {
      inventoryInfo = activeInventory
        .map(
          (inv) =>
            `- ${inv.fruit}：剩余${inv.remainBoxes}框（共${inv.boxes}框，进货成本¥${inv.pricePerBox}/框，${inv.date}进货）`
        )
        .join('\n');
    } else {
      inventoryInfo = '暂无库存';
    }

    let salesDetail = '';
    if (Object.keys(salesByDate).length > 0) {
      salesDetail = Object.entries(salesByDate)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .slice(0, 5)
        .map(([date, s]) => `- ${date}：卖了${s.boxes}框，收入¥${s.income}，利润¥${s.profit}`)
        .join('\n');
    }

    let locationDetail = '';
    if (Object.keys(salesByLocation).length > 0) {
      locationDetail = Object.entries(salesByLocation)
        .sort((a, b) => b[1].profit - a[1].profit)
        .map(([loc, s]) => `- ${loc}：去了${s.count}次，共卖${s.boxes}框，总利润¥${s.profit}`)
        .join('\n');
    }

    const prompt = `今天是${todayInfo.solarDate.toLocaleDateString('zh-CN')}，农历${todayInfo.lunarDateStr}，星期${todayInfo.weekDay}。
地区：甘肃省庆阳市正宁县

📅 今日集市：${markets.length > 0 ? todayMarketNames : '今天没有集市'}
📅 明日集市（农历${tomorrowLunar.lunarDateStr}，星期${tomorrowLunar.weekDay}）：${tomorrowMarkets.length > 0 ? tomorrowMarketNames : '明天没有集市'}

📦 当前库存：
${inventoryInfo}

📊 近7天销售汇总：
- 总收入：¥${totalIncome7d}，总利润：¥${totalProfit7d}，共卖出${totalBoxes7d}框
${salesDetail ? '\n按日期：\n' + salesDetail : ''}
${locationDetail ? '\n按地点：\n' + locationDetail : ''}

请帮我分析以下内容：
1. 🗓️ 今日赶集建议：今天该去哪里？如果没集，今天适合做什么准备？
2. 🗓️ 明日赶集建议：明天的集市安排和准备事项
3. 📦 库存提醒：库存是否充足，是否需要补货，哪些水果需要尽快卖出
4. 📈 生意状况：结合近几天的销售数据，生意怎么样，给点鼓励
5. 🌤️ 天气与注意事项：根据当前季节和地区（甘肃庆阳），提醒穿着、防寒/防晒、饮水等注意事项
6. 💪 关怀建议：摆摊辛苦，给一些暖心的话和健康提醒

不要给出具体的售卖价格建议。重点是关怀、鼓励和实用提醒。`;

    try {
      let lastUpdate = 0;
      const throttleDelay = 100;

      const finalText = await streamAI(prompt, (text) => {
        const now = Date.now();
        if (now - lastUpdate > throttleDelay) {
          setResult(text);
          lastUpdate = now;
        }
      });

      setResult(finalText);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setResult(
        `❌ AI 分析失败\n\n错误信息: ${error.message}\n\n可能原因：\n1. API 服务暂时不可用\n2. 网络连接问题\n3. API Key 配额用完\n\n请稍后重试或检查网络连接。`
      );
    }
  };

  return (
    <>
      {/* 悬浮按钮 */}
      <button
        onClick={handleAnalyze}
        className="fixed bottom-20 right-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg px-4 py-3 text-white text-sm font-bold hover:scale-105 active:scale-95 transition-transform z-40 flex items-center gap-2"
      >
        🤖 AI 分析
      </button>

      {/* AI 分析弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* 头部 */}
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-500 to-pink-500">
              <h3 className="text-lg font-bold text-white">AI 赶集助手</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setResult('');
                  setLoading(false);
                }}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            {/* 内容 */}
            <div className="flex-1 overflow-y-auto p-5">
              {loading && !result && (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <Loader2 size={32} className="animate-spin mb-3" />
                  <p className="text-sm">AI 正在分析中...</p>
                  <p className="text-xs mt-2 text-gray-400">正在分析库存、销售、集市和天气...</p>
                </div>
              )}

              {result && (
                <div className="prose prose-sm max-w-none">
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {result}
                  </div>
                  {loading && (
                    <span className="inline-block w-2 h-4 bg-purple-500 animate-pulse ml-1"></span>
                  )}
                </div>
              )}
            </div>

            {/* 底部 */}
            <div className="px-5 py-3 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                💡 AI 建议仅供参考，天气信息基于季节推测
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAnalysisButton;
