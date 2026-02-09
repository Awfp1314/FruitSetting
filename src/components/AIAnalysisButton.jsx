import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { streamAI } from '../utils/ai';

const AIAnalysisButton = ({ markets, todayInfo }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleAnalyze = async () => {
    setShowModal(true);
    setLoading(true);
    setResult('');

    const marketNames = markets.map((m) => m.name).join('、');
    const hasMarket = markets.length > 0;

    const prompt = `今天是${todayInfo.solarDate.toLocaleDateString('zh-CN')}，农历${todayInfo.lunarDateStr}，星期${todayInfo.weekDay}。
${hasMarket ? `今天有集的地方：${marketNames}` : '今天没有集市'}

我是一个摆摊卖水果的小商贩。请从摆摊人的角度分析：
1. ${hasMarket ? '今天适合去哪个集市摆摊？为什么？' : '今天没集，我应该做什么准备？'}
2. 需要注意什么？（天气、进货、定价等）
3. 给我具体的建议

请简洁实用，不超过150字。`;

    try {
      await streamAI(prompt, (text) => {
        setResult(text);
      });
    } catch (error) {
      console.error('AI 错误:', error);
      setResult(
        `❌ AI 分析失败\n\n错误信息: ${error.message}\n\n可能原因：\n1. API 服务暂时不可用\n2. 网络连接问题\n3. API Key 配额用完\n\n请稍后重试或检查控制台查看详细错误。`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 悬浮按钮 */}
      <button
        onClick={handleAnalyze}
        className="fixed bottom-20 right-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg px-4 py-3 text-white text-sm font-bold hover:scale-105 active:scale-95 transition-transform z-40 flex items-center gap-2"
      >
        AI 分析
      </button>

      {/* AI 分析弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4">
            {/* 头部 */}
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-500 to-pink-500">
              <h3 className="text-lg font-bold text-white">AI 摆摊建议</h3>
              <button
                onClick={() => setShowModal(false)}
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
