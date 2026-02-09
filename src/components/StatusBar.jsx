import { WifiOff, Activity } from 'lucide-react';

const StatusBar = ({ isOnline, latency }) => (
  <div className={`px-4 py-2 text-xs flex justify-between items-center sticky top-0 z-50 shadow-sm border-b transition-colors ${
    !isOnline ? 'bg-red-600 text-white' : 'bg-[#1e293b] text-white'
  }`}>
    <div className="flex items-center gap-2">
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
);

export default StatusBar;
