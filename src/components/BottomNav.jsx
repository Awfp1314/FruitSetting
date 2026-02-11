import { Home, User } from 'lucide-react';

const BottomNav = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'home', label: '首页', icon: Home },
    { id: 'profile', label: '我的', icon: User },
  ];

  return (
    <div className="bg-white border-t border-gray-200 shadow-lg z-50 safe-area-bottom flex-shrink-0">
      <div className="flex items-center justify-around h-16 max-w-2xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-orange-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon
                size={24}
                className={isActive ? 'mb-1' : 'mb-1'}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-xs font-bold ${isActive ? 'text-orange-600' : 'text-gray-500'}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
