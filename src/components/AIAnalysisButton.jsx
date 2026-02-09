import { useState } from 'react';
import { Sparkles, X, Loader2 } from 'lucide-react';
import { streamAI } from '../utils/ai';
import { getLunarInfo } from '../utils/lunar';

const AIAnalysisButton = ({ markets }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleAnalyze = async () => {
    setShowModal(true);
    setLoading(true);
    setResult('');

    const today = getLunarInfo();
    const marketNames = markets.map((m) => m.name).join('、');

    const prompt = `今天是${today.solarDate.toLocaleDateString('zh-CN')}，农历${today.lunarDateStr}，星期${today.weekDay}。
今天有集的地方：${marketNames || '无'}。

请分析：
1. 今天是否适合赶集？
2. 需要注意什么？
3. 给出具体建议。

请简洁回答，不超过200字。`;

    try {
      await streamAI(prompt, (text) => {
        setResult(text);
      });
    } catch (error) {
      setResult('❌ AI 分析失败，请稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 悬浮按钮 */}
      <button
        onClick={handleAnalyze}
        className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform z-40"
      >
        <Sparkles size={24} className="animate-pulse" />
      </button>

      {/* AI 分析弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4">
            {/* 头部 */}
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-500 to-pink-500">
              <div className="flex items-center gap-2 text-white">
                <Sparkles size={20} />
                <h3 className="text-lg font-bold">AI 赶集分析</h3>
              </div>
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
