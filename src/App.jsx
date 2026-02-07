import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, Tag, Gift, Sparkles, Save, Activity, Settings,
  MessageSquare, Edit3, Users, Box, AlignLeft, CalendarDays,
  WifiOff, Phone
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
  const [notifyTime, setNotifyTime] = useState('07:00');
  const [serverStatus, setServerStatus] = useState({ latency: 24, online: true, network: true });
  const [formData, setFormData] = useState({
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
  });
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date().toLocaleTimeString('zh-CN', { hour12: false }));
    updateTime();
    const timer = setInterval(() => {
      updateTime();
      if (serverStatus.online && serverStatus.network) {
        setServerStatus(prev => ({ ...prev, latency: Math.floor(Math.random() * 25 + 20) }));
      }
    }, 1000);
    const handleNet = () => setServerStatus(prev => ({ ...prev, network: window.navigator.onLine }));
    window.addEventListener('online', handleNet);
    window.addEventListener('offline', handleNet);
    return () => { clearInterval(timer); window.removeEventListener('online', handleNet); window.removeEventListener('offline', handleNet); };
  }, [serverStatus.online, serverStatus.network]);

  const getTodayDateStr = () => `今天（${new Date().toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric', weekday: 'long' })}）全天`;
  const insertName = () => {
    const placeholder = '@{name}';
    const text = formData.winnerTemplate;
    const start = textareaRef.current?.selectionStart || text.length;
    const newText = text.substring(0, start) + placeholder + text.substring(textareaRef.current?.selectionEnd || text.length);
    setFormData({ ...formData, winnerTemplate: newText });
  };

  const previewAnnouncement = `【老王今天赶集通知】\n📍时间地点：${getTodayDateStr()}，在【${formData.marketLocation}】大集。\n🚩摊位位置：${formData.detailLocation}\n🍎今日主打：${formData.mainProduct}，${formData.productDesc}\n💰今日价格：${formData.priceTitle}\n\n· 零售价：${formData.retailPrice}\n· 群友特权价：${formData.groupPrice}\n· 整筐拼团价：${formData.bulkPrice}\n  🎁今日福利：${formData.extraBenefit}\n  👴找老王：认准【老王】的白色小货车，来了就是客！`;
  const hasIssue = !serverStatus.network || !serverStatus.online;

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col">
      <div onClick={() => setServerStatus(p => ({ ...p, online: !p.online }))} className={`px-4 py-2 text-xs flex justify-between items-center sticky top-0 z-50 shadow-sm border-b transition-colors cursor-pointer ${hasIssue ? 'bg-red-600 text-white' : 'bg-[#1e293b] text-white'}`}>
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${hasIssue ? 'bg-white' : 'bg-green-500 animate-pulse'}`}></span>
          <span className="font-bold">{hasIssue ? "服务器/网络异常" : "服务器连接正常"}</span>
        </div>
        <div className="font-mono bg-black/20 px-2 rounded">{hasIssue ? 'OFFLINE' : `${serverStatus.latency}ms`}</div>
      </div>

      {hasIssue && (
        <div className="bg-red-50 border-b border-red-100 p-3 px-5">
          <div className="flex items-start gap-3 text-red-800 text-xs leading-relaxed">
            <Phone size={16} /> <div><strong>服务器冒烟了，请联系您的儿子（小王）：</strong><br/>138-xxxx-xxxx</div>
          </div>
        </div>
      )}

      <div className="bg-white sticky top-0 z-40 border-b border-gray-200">
        <div className="px-5 pt-6 pb-4">
          <h1 className="text-2xl font-black text-gray-900 leading-none mb-1">老王水果摊配置</h1>
          <p className="text-xs text-gray-400 font-mono italic">V3.5 Stable | {currentTime}</p>
        </div>
        <div className="flex border-t border-gray-200 font-bold text-sm">
          <button onClick={() => setActiveTab('config')} className={`flex-1 py-3 ${activeTab === 'config' ? 'bg-gray-100 border-b-2 border-gray-900' : 'text-gray-400'}`}>配置参数</button>
          <button onClick={() => setActiveTab('preview')} className={`flex-1 py-3 ${activeTab === 'preview' ? 'bg-gray-100 border-b-2 border-gray-900' : 'text-gray-400'}`}>预览消息</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-10">
        {activeTab === 'config' ? (
          <>
            <div className="bg-white border border-gray-200 p-5 space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <label className="text-sm font-bold flex items-center gap-2"><Clock size={16}/> 定时发送时间</label>
                <input type="time" value={notifyTime} onChange={e => setNotifyTime(e.target.value)} className="bg-gray-100 font-mono font-bold px-2 py-1 text-sm border outline-none"/>
              </div>
              <div className="space-y-4">
                <label className="text-xs text-gray-500 font-bold block">赶集地点 & 位置描述</label>
                <AutoTextarea value={formData.marketLocation} onChange={e => setFormData({...formData, marketLocation: e.target.value})} className="bg-gray-50 border p-3 font-bold text-gray-900"/>
                <AutoTextarea value={formData.detailLocation} onChange={e => setFormData({...formData, detailLocation: e.target.value})} className="bg-gray-50 border p-3 text-sm text-gray-600"/>
              </div>
            </div>

            <div className="bg-white border-t-4 border-orange-500 p-5 space-y-4">
              <div className="flex gap-4 border-b pb-4">
                <div className="flex-1"><label className="text-[10px] text-gray-400 font-bold">今日主打</label><AutoTextarea value={formData.mainProduct} onChange={e => setFormData({...formData, mainProduct: e.target.value})} className="text-lg font-bold text-orange-600"/></div>
                <div className="flex-1"><label className="text-[10px] text-gray-400 font-bold">描述</label><AutoTextarea value={formData.productDesc} onChange={e => setFormData({...formData, productDesc: e.target.value})} className="text-sm text-gray-500"/></div>
              </div>
              <div className="bg-gray-50 p-4 border space-y-3">
                <div className="grid grid-cols-3 items-start gap-2"><span className="text-xs font-bold text-gray-500 mt-2">价格主标</span><div className="col-span-2"><AutoTextarea value={formData.priceTitle} onChange={e => setFormData({...formData, priceTitle: e.target.value})} className="bg-white border p-2 text-sm font-bold text-orange-600"/></div></div>
                <div className="grid grid-cols-3 items-start gap-2"><span className="text-xs text-gray-500 mt-2">零售价</span><div className="col-span-2"><AutoTextarea value={formData.retailPrice} onChange={e => setFormData({...formData, retailPrice: e.target.value})} className="bg-white border p-2 text-sm"/></div></div>
                <div className="grid grid-cols-3 items-start gap-2"><span className="text-xs text-gray-500 mt-2">群友价</span><div className="col-span-2"><AutoTextarea value={formData.groupPrice} onChange={e => setFormData({...formData, groupPrice: e.target.value})} className="bg-white border p-2 text-sm"/></div></div>
                <div className="pt-2 border-t"><label className="text-[10px] text-gray-400 font-bold flex items-center gap-1"><Box size={10}/> 拼团/福利</label><AutoTextarea value={formData.bulkPrice} onChange={e => setFormData({...formData, bulkPrice: e.target.value})} className="bg-white border p-2 text-xs mb-2"/><AutoTextarea value={formData.extraBenefit} onChange={e => setFormData({...formData, extraBenefit: e.target.value})} className="bg-white border p-2 text-xs"/></div>
              </div>
            </div>

            <div className="bg-white border p-5 space-y-4">
              <div className="flex justify-between items-center border-b pb-2"><h3 className="text-xs font-bold text-gray-400 tracking-wider">抽奖贺信</h3><button onClick={insertName} className="bg-gray-900 text-white px-2 py-1 text-[10px] font-bold">＋ 插入变量</button></div>
              <AutoTextarea forwardedRef={textareaRef} value={formData.winnerTemplate} onChange={e => setFormData({...formData, winnerTemplate: e.target.value})} className="bg-gray-50 border p-3 text-sm text-gray-700"/>
            </div>

            <button onClick={() => !hasIssue && alert('已同步到云端')} disabled={hasIssue} className={`w-full font-bold py-4 shadow-md text-sm transition-all ${hasIssue ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#2C3E50] text-white'}`}>
              {hasIssue ? '连接断开，暂不可保存' : '保存配置'}
            </button>
          </>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-center"><span className="bg-gray-300 text-white text-[10px] px-2 py-0.5 rounded">上午 {notifyTime}</span></div>
            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 rounded bg-[#FA9D3B] flex items-center justify-center text-white font-bold shadow-sm">王</div>