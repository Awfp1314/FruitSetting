import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { streamAI } from '../utils/ai';
import { dataManager } from '../utils/dataManager';

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

  const handleAnalyze = async () => {
    console.log('开始分析...');
    setShowModal(true);
    setLoading(true);
    setResult('');

    // 获取记账数据
    const accountData = dataManager.load();
    const { inventory = [], sales = [] } = accountData;

    // 获取活跃库存
    const activeInventory = inventory.filter(
      (inv) => inv.status === 'active' && inv.remainBoxes > 0
    );

    // 获取最近7天的销售记录
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentSales = sales.filter((s) => new Date(s.date) >= sevenDaysAgo);

    // 统计最近销售情况
    const salesByLocation = {};
    recentSales.forEach((sale) => {
      if (!salesByLocation[sale.location]) {
        salesByLocation[sale.location] = { count: 0, profit: 0 };
      }
      salesByLocation[sale.location].count++;
      salesByLocation[sale.location].profit += sale.profit || 0;
    });

    // 构建提示词
    const marketNames = markets.map((m) => m.name).join('、');
    const hasMarket = markets.length > 0;

    let inventoryInfo = '';
    if (activeInventory.length > 0) {
      inventoryInfo =
        '\n\n当前库存：\n' +
        activeInventory
          .map(
            (inv) =>
              `- ${inv.fruit}：剩余 ${inv.remainBoxes} 框（共 ${inv.boxes} 框，成本 ¥${inv.pricePerBox}/框）`
          )
          .join('\n');
    }

    let salesInfo = '';
    if (recentSales.length > 0) {
      salesInfo = '\n\n最近7天销售情况：\n';
      const locationStats = Object.entries(salesByLocation)
        .sort((a, b) => b[1].profit - a[1].profit)
        .slice(0, 3);

      salesInfo += locationStats
        .map(([location, stats]) => `- ${location}：${stats.count}次，利润 ¥${stats.profit}`)
        .join('\n');
    }

    const prompt = `今天是${todayInfo.solarDate.toLocaleDateString('zh-CN')}，农历${todayInfo.lunarDateStr}，星期${todayInfo.weekDay}。
${hasMarket ? `今天有集的地方：${marketNames}` : '今天没有集市'}${inventoryInfo}${salesInfo}

我是一个摆摊卖水果的小商贩。请从摆摊人的角度分析：
1. ${hasMarket ? '今天适合去哪个集市摆摊？为什么？' : '今天没集，我应该做什么准备？'}
2. 结合我的库存和历史销售情况，给出具体建议
3. 需要注意什么？（定价、销售策略等）

请简洁实用，不超过200字。`;

    try {
      // 使用节流来减少状态更新频率
      let lastUpdate = 0;
      const throttleDelay = 100; // 100ms 更新一次

      const finalText = await streamAI(prompt, (text) => {
        const now = Date.now();
        if (now - lastUpdate > throttleDelay) {
          console.log('收到文本片段，长度:', text.length);
          setResult(text);
          lastUpdate = now;
        }
      });

      console.log('AI 分析完成，最终文本:', finalText);
      setResult(finalText);
      setLoading(false);
    } catch (error) {
      console.error('AI 错误:', error);
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
              <h3 className="text-lg font-bold text-white">AI 摆摊建议</h3>
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
                  <p className="text-xs mt-2 text-gray-400">正在结合你的库存和销售数据</p>
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
                💡 AI 建议仅供参考，请结合实际情况判断
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAnalysisButton;
