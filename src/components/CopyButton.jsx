import { Copy, CheckCircle2 } from 'lucide-react';

const CopyButton = ({ onClick, isCopied }) => (
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

export default CopyButton;
