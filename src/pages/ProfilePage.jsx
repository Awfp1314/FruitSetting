import { Settings, Info, Github, Heart, Download } from 'lucide-react';
import { useToast } from '../components/Toast';

const ProfilePage = () => {
  const { showToast } = useToast();

  const menuItems = [
    {
      icon: Info,
      label: '关于应用',
      value: 'V2.0',
      onClick: () => showToast('老王工具箱 V2.0 · 专为小生意人打造', 'info'),
    },
    {
      icon: Github,
      label: '项目地址',
      value: 'GitHub',
      onClick: () => window.open('https://github.com/Awfp1314/FruitSetting', '_blank'),
    },
    {
      icon: Download,
      label: '安装应用',
      value: '添加到桌面',
      onClick: () => showToast('点击浏览器菜单，选择"添加到主屏幕"即可安装', 'info', 3000),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans text-slate-900 pb-16">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-5 pt-5 pb-4">
          <h1 className="text-2xl font-black text-gray-900 leading-none mb-1">我的</h1>
          <p className="text-xs text-gray-400 font-mono italic">个人中心</p>
        </div>
      </div>

      {/* 内容 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* 功能菜单 */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors active:bg-gray-100 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{item.label}</span>
                  </div>
                  <span className="text-xs text-gray-400">{item.value}</span>
                </button>
              );
            })}
          </div>

          {/* 数据说明 */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Heart size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-gray-600 leading-relaxed">
                <p className="font-bold text-gray-900 mb-1">数据安全说明</p>
                <p>所有数据仅保存在您的设备本地，不会上传到服务器。您可以放心使用。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
