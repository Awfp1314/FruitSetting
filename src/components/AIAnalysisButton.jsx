import { useState, useEffect, useRef } from 'react';
import { X, Loader2, Send } from 'lucide-react';
import { streamAI } from '../utils/ai';
import { collectBusinessContext } from '../utils/aiContext';
import { hasAIConfig } from '../utils/aiConfig';

const AIAnalysisButton = ({ markets, todayInfo }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (userMsg, isFirst = false) => {
    // 检查配置
    if (!hasAIConfig()) {
      setMessages([
        {
          role: 'ai',
          content: '❌ 请先在"我的"页面配置 API Key 才能使用 AI 功能',
        },
      ]);
      return;
    }

    setLoading(true);

    const context = collectBusinessContext(markets, todayInfo);
    let prompt;

    if (isFirst) {
      prompt = `${context}\n\n请基于以上数据，务实地分析：\n1. 今日和明日赶集安排\n2. 库存情况：如实分析卖货速度\n3. 生意状况：基于数据客观分析\n4. 天气和注意事项\n5. 说几句实在的关心话\n\n不要盲目乐观，实事求是。`;
    } else {
      prompt = `${context}\n\n以上是我的生意数据。用户问：${userMsg}`;
    }

    const aiMsgIndex = messages.length + (isFirst ? 0 : 1);
    if (!isFirst) {
      setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    }
    setMessages((prev) => [...prev, { role: 'ai', content: '' }]);

    try {
      let lastUpdate = 0;
      const finalText = await streamAI(prompt, (text) => {
        const now = Date.now();
        if (now - lastUpdate > 80) {
          setMessages((prev) => {
            const updated = [...prev];
            updated[aiMsgIndex] = { role: 'ai', content: text };
            return updated;
          });
          lastUpdate = now;
        }
      });
      setMessages((prev) => {
        const updated = [...prev];
        updated[aiMsgIndex] = { role: 'ai', content: finalText };
        return updated;
      });
    } catch (error) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[aiMsgIndex] = { role: 'ai', content: `❌ 分析失败：${error.message}` };
        return updated;
      });
    }
    setLoading(false);
  };

  const handleOpen = () => {
    setShowModal(true);
    setMessages([]);
    setInput('');
    sendMessage('', true);
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    sendMessage(msg);
  };

  const handleClose = () => {
    setShowModal(false);
    setMessages([]);
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="fixed bottom-20 right-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg text-white hover:scale-105 active:scale-95 transition-transform z-40 flex items-center justify-center"
      >
        <span className="text-xl">🤖</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex flex-col">
          <div className="flex-1 flex flex-col bg-[#F0F2F5] mt-8 rounded-t-2xl overflow-hidden">
            {/* 头部 */}
            <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <h3 className="text-base font-bold">AI 赶集助手</h3>
              <button onClick={handleClose} className="p-1 hover:bg-white/20 rounded">
                <X size={18} />
              </button>
            </div>

            {/* 消息列表 */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-purple-500 text-white rounded-br-md'
                        : 'bg-white text-gray-700 rounded-bl-md shadow-sm'
                    }`}
                  >
                    {msg.content ? (
                      <span className="whitespace-pre-wrap">{msg.content}</span>
                    ) : (
                      <Loader2 size={16} className="animate-spin text-gray-400" />
                    )}
                    {loading && i === messages.length - 1 && msg.role === 'ai' && msg.content && (
                      <span className="inline-block w-1.5 h-4 bg-purple-500 animate-pulse ml-0.5 align-middle"></span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 输入框 */}
            <div className="px-4 py-3 bg-white border-t border-gray-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="继续问点什么..."
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm outline-none focus:bg-white focus:ring-2 focus:ring-purple-300 transition-all disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white active:scale-95 transition-transform disabled:opacity-40"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-2">AI 建议仅供参考</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAnalysisButton;
