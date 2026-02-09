import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Loader2, Trash2 } from 'lucide-react';
import { streamAI } from '../utils/ai';
import { collectBusinessContext } from '../utils/aiContext';
import { getLunarInfo } from '../utils/lunar';

const AIChatPage = ({ onBack }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // 打招呼
    const todayInfo = getLunarInfo();
    const hour = new Date().getHours();
    let greeting = '你好';
    if (hour < 9) greeting = '早上好';
    else if (hour < 12) greeting = '上午好';
    else if (hour < 14) greeting = '中午好';
    else if (hour < 18) greeting = '下午好';
    else greeting = '晚上好';

    setMessages([
      {
        role: 'ai',
        content: `${greeting}！我是你的AI助手 🤖\n\n我了解你的库存、销售和赶集情况，有什么想聊的随时问我。比如：\n\n• 最近生意怎么样？\n• 明天去哪赶集好？\n• 库存还够卖几天？\n• 今天累不累，聊聊天`,
      },
    ]);
  }, []);

  const sendMessage = async (userMsg) => {
    if (!userMsg.trim() || loading) return;
    setLoading(true);

    const todayInfo = getLunarInfo();
    const savedMarkets = localStorage.getItem('marketSchedule');
    const allMarkets = savedMarkets ? JSON.parse(savedMarkets) : [];
    const todayDay = todayInfo.lunarDay % 10;
    const todayMarkets = allMarkets.filter((m) => m.days.includes(todayDay));

    const context = collectBusinessContext(todayMarkets, todayInfo);
    const prompt = `${context}\n\n以上是我的生意数据背景。用户说：${userMsg}`;

    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages([...newMessages, { role: 'ai', content: '' }]);
    const aiIndex = newMessages.length;

    try {
      let lastUpdate = 0;
      const finalText = await streamAI(prompt, (text) => {
        const now = Date.now();
        if (now - lastUpdate > 80) {
          setMessages((prev) => {
            const updated = [...prev];
            updated[aiIndex] = { role: 'ai', content: text };
            return updated;
          });
          lastUpdate = now;
        }
      });
      setMessages((prev) => {
        const updated = [...prev];
        updated[aiIndex] = { role: 'ai', content: finalText };
        return updated;
      });
    } catch (error) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[aiIndex] = { role: 'ai', content: `❌ 出错了：${error.message}` };
        return updated;
      });
    }
    setLoading(false);
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    sendMessage(msg);
  };

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
            <div>
              <h1 className="text-xl font-black text-gray-900">AI 助手</h1>
            </div>
          </div>
          <button
            onClick={() => {
              setMessages([{ role: 'ai', content: '已清空对话，有什么想聊的？' }]);
            }}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Trash2 size={18} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* 消息列表 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 pb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'ai' && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                <span className="text-xs">🤖</span>
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
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
            placeholder="随便聊点什么..."
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
      </div>
    </div>
  );
};

export default AIChatPage;
