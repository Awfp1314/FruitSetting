import CopyButton from './CopyButton';

const PreviewTab = ({ fullText, winnerText, copyStatus, onCopy }) => (
  <div className="space-y-8 animate-in fade-in duration-300 pb-20 pt-4">
    <div className="flex gap-3 items-start">
      <div className="w-10 h-10 rounded bg-[#FA9D3B] flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0 mt-1">
        王
      </div>
      <div className="flex flex-col items-start gap-1 max-w-[85%]">
        <span className="text-[10px] text-gray-400 ml-1">老王水果摊</span>
        <div className="bg-white p-3 rounded-md shadow-sm text-[15px] text-[#111] leading-relaxed whitespace-pre-wrap border border-gray-200">
          {fullText}
        </div>
        <CopyButton 
          onClick={() => onCopy(fullText, 1)} 
          isCopied={copyStatus === 1}
        />
      </div>
    </div>

    <div className="flex gap-3 items-start">
      <div className="w-10 h-10 rounded bg-[#FA9D3B] flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0 mt-1">
        王
      </div>
      <div className="flex flex-col items-start gap-1 max-w-[85%]">
        <span className="text-[10px] text-gray-400 ml-1">老王水果摊</span>
        <div className="bg-white p-3 rounded-md shadow-sm text-[15px] text-[#111] leading-relaxed whitespace-pre-wrap border border-gray-200">
          {winnerText}
        </div>
        <CopyButton 
          onClick={() => onCopy(winnerText, 2)} 
          isCopied={copyStatus === 2}
        />
      </div>
    </div>
  </div>
);

export default PreviewTab;
