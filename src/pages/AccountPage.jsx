import { useState } from 'react';
import { Plus, TrendingUp, DollarSign, Package } from 'lucide-react';
import StatusBar from '../components/StatusBar';
import { useAccountData } from '../hooks/useAccountData';

const AccountPage = ({ onNavigate }) => {
  const { records, getStats } = useAccountData();
  const [showAddForm, setShowAddForm] = useState(false);

  const stats = getStats(30);

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans text-slate-900 pb-16">
      <StatusBar isOnline={true} latency={24} />

      {/* 头部 */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-5 pt-5 pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-gray-900 leading-none mb-1">记账本</h1>
            <p className="text-xs text-gray-400 font-mono italic">摆摊收支记录</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md active:scale-95 transition-transform"
          >
            <Plus size={16} />
            记一笔
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 本月统计 */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 shadow-lg p-5 rounded-lg text-white">
          <h2 className="text-sm font-bold mb-4 opacity-90">本月统计</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="flex items-center gap-1 mb-1 opacity-80">
                <DollarSign size={14} />
                <span className="text-xs">收入</span>
              </div>
              <p className="text-xl font-black">¥{stats.totalIncome}</p>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1 opacity-80">
                <TrendingUp size={14} />
                <span className="text-xs">利润</span>
              </div>
              <p className="text-xl font-black">¥{stats.totalProfit}</p>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1 opacity-80">
                <Package size={14} />
                <span className="text-xs">记录</span>
              </div>
              <p className="text-xl font-black">{stats.recordCount}笔</p>
            </div>
          </div>
        </div>

        {/* 记录列表 */}
        <div className="space-y-3">
          {records.length === 0 ? (
            <div className="bg-white border border-gray-200 p-8 rounded-lg text-center">
              <p className="text-gray-400 mb-2">还没有记录</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="text-orange-600 font-bold text-sm"
              >
                点击"记一笔"开始记账
              </button>
            </div>
          ) : (
            records.map((record) => (
              <div
                key={record.id}
                className="bg-white border border-gray-200 shadow-sm p-4 rounded-lg hover:shadow-md transition-shadow"
                onClick={() => onNavigate('account-detail', record.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base font-bold text-gray-900">{record.fruit}</span>
                      <span className="text-xs text-gray-500">{record.location}</span>
                    </div>
                    <p className="text-xs text-gray-400">{record.date}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-black ${
                        record.profit >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {record.profit >= 0 ? '+' : ''}¥{record.profit}
                    </p>
                    <p className="text-xs text-gray-500">
                      {record.sellBoxes}/{record.buyBoxes}框
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 添加记录弹窗 */}
      {showAddForm && (
        <AddRecordModal onClose={() => setShowAddForm(false)} onNavigate={onNavigate} />
      )}
    </div>
  );
};

// 添加记录弹窗组件
const AddRecordModal = ({ onClose, onNavigate }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-5">
          <h3 className="text-lg font-bold mb-4">记一笔账</h3>
          <button
            onClick={() => {
              onClose();
              onNavigate('account-add');
            }}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold"
          >
            开始记账
          </button>
          <button onClick={onClose} className="w-full mt-2 py-3 text-gray-600">
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
