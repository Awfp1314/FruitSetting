import React, { useState, useEffect, useRef } from 'react';
import { 
  Tag, Gift, Sparkles, Activity, Settings,
  MessageSquare, Edit3, Box, AlignLeft,
  WifiOff, Copy, CheckCircle2, Signal
} from 'lucide-react';

const AutoTextarea = ({ className, value, onChange, name, placeholder, rows = 1, forwardedRef }) => {
  const localRef = useRef(null);
  const ref = forwardedRef || localRef;
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [value, ref]);
  return (
    <textarea
      ref={ref}
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      className={`${className} resize-none overflow-hidden block w-full leading-normal outline-none`}
    />
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('config');
  const [currentTime, setCurrentTime] = useState('');
  
  // 网络状态监测
  const [isOnline, setIsOnline] = useState(true);
  const [latency, setLatency] = useState(24);
  
  // 默认数据
  const defaultData = {
    marketLocation: '榆林子镇',
    detailLocation: '进了集市，顺着兴旺路走到头，白色小货车就是！',
    mainProduct: '冰糖酥梨',
    productDesc: '又甜又多汁！',
    priceTitle: '十块钱三斤',
    retailPrice: '10元3斤',
    groupPrice: '10元3.3斤（买的时候说“我是群里的”）',
    bulkPrice: '3人成团100元/筐（约20斤，巨划算！想拼的下面接龙）',
    extraBenefit: '新群友首次买，免费多送您2个！老客户多送1个！',
    winnerTemplate: '恭喜 @{name} 成为今日手气王！🎉 截个图，下次在当地的话赶集找老王领十块钱的水果！'
  };

  const [formData, setFormData] = useState(defaultData);
  
  // 复制状态 (0: 无, 1: 复制了通知, 2: 复制了贺信)
  const [copyStatus, setCopyStatus] = useState(0); 
  const textareaRef = useRef(null);

  // 初始化
  useEffect(() => {
    // 读取本地存储
    const savedData = localStorage.getItem('fruitData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    
    // 时间更新
    const updateTime = () => setCurrentTime(new Date().toLocaleTimeString('zh-CN', { hour12: false }));
    updateTime();
    const timer = setInterval(() => {
      updateTime();
      // 模拟延迟波动，增加科技感
      if (window.navigator.onLine) {
        setLatency(Math.floor(Math.random() * (45 - 20) + 20));
      }
    }, 1000);
    
    // 网络监听
    const handleNet = () => setIsOnline(window.navigator.onLine);
    window.addEventListener('online', handleNet);
    window.addEventListener('offline', handleNet);
    
    return () => { clearInterval(timer); window.removeEventListener('online', handleNet); window.removeEventListener('offline', handleNet); };
  }, []);

  // 自动保存
  useEffect(() => {
    localStorage.setItem('fruitData', JSON.stringify(formData));
  }, [formData]);

  const getTodayDateStr = () => `今天（${new Date().toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric', weekday: 'long' })}）全天`;
  
  const insertName = () => {
    const placeholder = '@{name}';
    const text = formData.winnerTemplate;
    const start = textareaRef.current?.selectionStart || text.length;
    const newText = text.substring(0, start) + placeholder + text.substring(textareaRef.current?.selectionEnd || text.length);
    setFormData({ ...formData, winnerTemplate: newText });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 生成文案
  const generateFullText = () => {
    return `【老王今天赶集通知】
📍时间地点：${getTodayDateStr()}，在【${formData.marketLocation}】大集。
🚩摊位位置：${formData.detailLocation}
🍎今日主打：${formData.mainProduct}，${formData.productDesc}
💰今日价格：${formData.priceTitle}

· 零售价：${formData.retailPrice}
· 群友特权价：${formData.groupPrice}
· 整筐拼团价：${formData.bulkPrice}
  🎁今日福利：${formData.extraBenefit}
  👴找老王：认准【老王】的白色小货车，来了就是客！`;
  };
  
  const previewWinnerMsg = formData.winnerTemplate.replace(/@\{name\}/g, '@隔壁小张');

  // 通用复制功能
  const copyText = async (text, typeId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(typeId);
      setTimeout(() => setCopyStatus(0), 2000);
    } catch (err) {
      alert("❌ 复制失败，请手动长按文字复制");
    }
  };

  // 复制按钮组件
  const CopyBtn = ({ onClick, isCopied }) => (
    <button 
      onClick={onClick}
      className={`mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
        isCopied 
          ? 'bg-green-100 text-green-700' 
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      }`}
    >
      {isCopied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
      {isCopied ? '已复制' : '复制文案'}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans text-slate-900">
      
      {/* 顶部服务器状态栏 (保留科技感) */}
      <div className={`px-4 py-2 text-xs flex justify-between items-center sticky top-0 z-50 shadow-sm border-b transition-colors ${
        !isOnline ? 'bg-red-600 text-white' : 'bg-[#1e293b] text-white'
      }`}>
        <div className="flex items-center gap-2">
          {/* 呼吸灯 */}
          <div className="relative flex h-2.5 w-2.5">
            {!isOnline ? (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            ) : (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </>
            )}
          </div>
          <span className="font-medium tracking-wide">
            {!isOnline ? "网络已断开 (本地模式)" : "服务器连接正常"}
          </span>
        </div>
        
        <div className={`flex items-center gap-2 font-mono px-2 py-0.5 rounded ${
          !isOnline ? 'bg-red-800/30' : 'bg-black/20 text-gray-400'
        }`}>
          {!isOnline ? <WifiOff size={12} /> : <Activity size={12} className="text-green-400" />}
          <span>{!isOnline ? 'OFFLINE' : `${latency}ms`}</span>
        </div>
      </div>

      {/* 标题栏 */}
      <div className="bg-white sticky top-[34px] z-40 border-b border-gray-200 shadow-sm">
        <div className="px-5 pt-5 pb-4">
          <h1 className="text-2xl font-black text-gray-900 leading-none mb-1">老王水果摊配置</h1>
          <p className="text-xs text-gray-400 font-mono italic">V4.1 Lite | {currentTime}</p>
        </div>
        <div className="flex border-t border-gray-200 font-bold text-sm">
          <button 
            onClick={() => setActiveTab('config')} 
            className={`flex-1 py-3 flex items-center justify-center gap-2 transition-colors ${activeTab === 'config' ? 'bg-gray-100 border-b-2 border-gray-900 text-gray-900' : 'text-gray-400'}`}
          >
            <Edit3 size={16} /> 编辑
          </button>
          <button 
            onClick={() => setActiveTab('preview')} 
            className={`flex-1 py-3 flex items-center justify-center gap-2 transition-colors ${activeTab === 'preview' ? 'bg-gray-100 border-b-2 border-gray-900 text-gray-900' : 'text-gray-400'}`}
          >
            <MessageSquare size={16} /> 预览
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-10">
        {activeTab === 'config' ? (
          <>
            {/* 基础配置 (删除了定时发送) */}
            <div className="bg-white border border-gray-200 shadow-sm p-5 space-y-4 rounded-sm animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                <AlignLeft size={14} /> 基础信息
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 font-bold block mb-1">赶集地点</label>
                  <AutoTextarea name="marketLocation" value={formData.marketLocation} onChange={handleInputChange} className="bg-gray-50 border border-gray-200 p-3 font-bold text-gray-900 rounded-sm"/>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-bold block mb-1">位置描述</label>
                  <AutoTextarea name="detailLocation" value={formData.detailLocation} onChange={handleInputChange} className="bg-gray-50 border border-gray-200 p-3 text-sm text-gray-600 rounded-sm"/>
                </div>
              </div>
            </div>

            {/* 商品配置 */}
            <div className="bg-white border-t-4 border-orange-500 shadow-sm p-5 space-y-4 rounded-sm animate-in fade-in slide-in-from-bottom-3">
              <div className="flex gap-4 border-b border-gray-100 pb-4">
                <div className="flex-1">
                  <label className="text-[10px] text-gray-400 font-bold mb-1 block">今日主打</label>
                  <AutoTextarea name="mainProduct" value={formData.mainProduct} onChange={handleInputChange} className="text-lg font-bold text-orange-600 border-b border-dashed border-orange-200 placeholder:text-gray-300"/>
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-gray-400 font-bold mb-1 block">描述</label>
                  <AutoTextarea name="productDesc" value={formData.productDesc} onChange={handleInputChange} className="text-sm text-gray-500 border-b border-dashed border-gray-200 placeholder:text-gray-300"/>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 border border-gray-200 rounded-sm space-y-3">
                <div className="grid grid-cols-3 items-start gap-2">
                  <span className="text-xs font-bold text-gray-500 mt-2">价格主标</span>
                  <div className="col-span-2"><AutoTextarea name="priceTitle" value={formData.priceTitle} onChange={handleInputChange} className="bg-white border border-gray-200 p-2 text-sm font-bold text-orange-600 rounded-sm"/></div>
                </div>
                <div className="grid grid-cols-3 items-start gap-2">
                  <span className="text-xs text-gray-500 mt-2">零售价</span>
                  <div className="col-span-2"><AutoTextarea name="retailPrice" value={formData.retailPrice} onChange={handleInputChange} className="bg-white border border-gray-200 p-2 text-sm rounded-sm"/></div>
                </div>
                <div className="grid grid-cols-3 items-start gap-2">
                  <span className="text-xs text-gray-500 mt-2">群友价</span>
                  <div className="col-span-2"><AutoTextarea name="groupPrice" value={formData.groupPrice} onChange={handleInputChange} className="bg-white border border-gray-200 p-2 text-sm rounded-sm"/></div>
                </div>
                
                <div className="pt-2 border-t border-gray-200">
                  <label className="text-[10px] text-gray-400 font-bold flex items-center gap-1 mb-2"><Box size={10}/> 拼团/福利</label>
                  <AutoTextarea name="bulkPrice" value={formData.bulkPrice} onChange={handleInputChange} className="bg-white border border-gray-200 p-2 text-xs mb-2 rounded-sm" placeholder="拼团信息"/>
                  <AutoTextarea name="extraBenefit" value={formData.extraBenefit} onChange={handleInputChange} className="bg-white border border-gray-200 p-2 text-xs rounded-sm" placeholder="福利信息"/>
                </div>
              </div>
            </div>

            {/* 抽奖配置 */}
            <div className="bg-white border border-gray-200 shadow-sm p-5 space-y-4 rounded-sm animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <h3 className="text-xs font-bold text-gray-400 tracking-wider flex items-center gap-1"><Sparkles size={12}/> 抽奖贺信</h3>
                <button onClick={insertName} className="bg-gray-900 text-white px-2 py-1 text-[10px] font-bold rounded-sm active:scale-95 transition-transform">＋ 插入名字</button>
              </div>
              <AutoTextarea forwardedRef={textareaRef} name="winnerTemplate" value={formData.winnerTemplate} onChange={handleInputChange} className="bg-gray-50 border border-gray-200 p-3 text-sm text-gray-700 rounded-sm" rows={3}/>
            </div>
            
            <div className="text-center text-xs text-gray-400 py-4">
              修改即自动保存到本机，下次打开还在
            </div>
          </>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-300 pb-20 pt-4">
            
            {/* 消息 1: 赶集通知 */}
            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 rounded bg-[#FA9D3B] flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0 mt-1">王</div>
              <div className="flex flex-col items-start gap-1 max-w-[85%]">
                <span className="text-[10px] text-gray-400 ml-1">老王水果摊</span>
                <div className="bg-white p-3 rounded-md shadow-sm text-[15px] text-[#111] leading-relaxed whitespace-pre-wrap border border-gray-200">
                  {generateFullText()}
                </div>
                {/* 独立复制按钮 1 */}
                <CopyBtn 
                  onClick={() => copyText(generateFullText(), 1)} 
                  isCopied={copyStatus === 1}
                />
              </div>
            </div>

            {/* 消息 2: 中奖贺信 */}
            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 rounded bg-[#FA9D3B] flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0 mt-1">王</div>
              <div className="flex flex-col items-start gap-1 max-w-[85%]">
                <span className="text-[10px] text-gray-400 ml-1">老王水果摊</span>
                <div className="bg-white p-3 rounded-md shadow-sm text-[15px] text-[#111] leading-relaxed whitespace-pre-wrap border border-gray-200">
                  {previewWinnerMsg}
                </div>
                {/* 独立复制按钮 2 */}
                <CopyBtn 
                  onClick={() => copyText(formData.winnerTemplate.replace(/@\{name\}/g, ''), 2)} 
                  isCopied={copyStatus === 2}
                />
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default App;


