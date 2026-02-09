import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const COLORS = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);

  const showToast = useCallback((message, type = 'success', duration = 2000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const showConfirm = useCallback((message) => {
    return new Promise((resolve) => {
      setConfirmState({ message, resolve });
    });
  }, []);

  const handleConfirm = (result) => {
    confirmState?.resolve(result);
    setConfirmState(null);
  };

  return (
    <ToastContext.Provider value={{ showToast, showConfirm }}>
      {children}

      {/* Toast 列表 */}
      <div className="fixed top-12 left-0 right-0 z-[100] flex flex-col items-center gap-2 pointer-events-none px-4">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type];
          return (
            <div
              key={toast.id}
              className={`${COLORS[toast.type]} text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2.5 animate-toast-in pointer-events-auto max-w-sm w-full`}
            >
              <Icon size={18} className="flex-shrink-0" />
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
          );
        })}
      </div>

      {/* Confirm 弹窗 */}
      {confirmState && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-toast-in">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={24} className="text-orange-500" />
              </div>
              <p className="text-center text-gray-800 text-sm leading-relaxed">
                {confirmState.message}
              </p>
            </div>
            <div className="flex border-t border-gray-200">
              <button
                onClick={() => handleConfirm(false)}
                className="flex-1 py-3.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors border-r border-gray-200"
              >
                取消
              </button>
              <button
                onClick={() => handleConfirm(true)}
                className="flex-1 py-3.5 text-sm font-bold text-orange-500 hover:bg-orange-50 transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
