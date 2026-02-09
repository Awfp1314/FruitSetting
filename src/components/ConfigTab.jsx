import { AlignLeft, Box, Sparkles } from 'lucide-react';
import AutoTextarea from './AutoTextarea';

const ConfigTab = ({ formData, onInputChange, textareaRef }) => (
  <>
    <div className="bg-white border border-gray-200 shadow-sm p-5 space-y-4 rounded-sm animate-in fade-in slide-in-from-bottom-2">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-2">
        <AlignLeft size={14} /> 基础信息
      </h3>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-500 font-bold block mb-1">赶集地点</label>
          <AutoTextarea 
            name="marketLocation" 
            value={formData.marketLocation} 
            onChange={onInputChange} 
            className="bg-gray-50 border border-gray-200 px-3 py-2 font-bold text-gray-900 rounded-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 font-bold block mb-1">位置描述</label>
          <AutoTextarea 
            name="detailLocation" 
            value={formData.detailLocation} 
            onChange={onInputChange} 
            className="bg-gray-50 border border-gray-200 px-3 py-2 text-sm text-gray-600 rounded-sm"
          />
        </div>
      </div>
    </div>

    <div className="bg-white border-t-4 border-orange-500 shadow-sm p-5 space-y-4 rounded-sm animate-in fade-in slide-in-from-bottom-3">
      <div className="flex gap-4 border-b border-gray-100 pb-4">
        <div className="flex-1">
          <label className="text-[10px] text-gray-400 font-bold mb-1 block">今日主打</label>
          <AutoTextarea 
            name="mainProduct" 
            value={formData.mainProduct} 
            onChange={onInputChange} 
            className="text-lg font-bold text-orange-600 border-b border-dashed border-orange-200 placeholder:text-gray-300"
          />
        </div>
        <div className="flex-1">
          <label className="text-[10px] text-gray-400 font-bold mb-1 block">描述</label>
          <AutoTextarea 
            name="productDesc" 
            value={formData.productDesc} 
            onChange={onInputChange} 
            className="text-sm text-gray-500 border-b border-dashed border-gray-200 placeholder:text-gray-300"
          />
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 border border-gray-200 rounded-sm space-y-3">
        <div className="grid grid-cols-3 items-start gap-2">
          <span className="text-xs font-bold text-gray-500 mt-2">价格主标</span>
          <div className="col-span-2">
            <AutoTextarea 
              name="priceTitle" 
              value={formData.priceTitle} 
              onChange={onInputChange} 
              className="bg-white border border-gray-200 p-2 text-sm font-bold text-orange-600 rounded-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 items-start gap-2">
          <span className="text-xs text-gray-500 mt-2">零售价</span>
          <div className="col-span-2">
            <AutoTextarea 
              name="retailPrice" 
              value={formData.retailPrice} 
              onChange={onInputChange} 
              className="bg-white border border-gray-200 p-2 text-sm rounded-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 items-start gap-2">
          <span className="text-xs text-gray-500 mt-2">群友价</span>
          <div className="col-span-2">
            <AutoTextarea 
              name="groupPrice" 
              value={formData.groupPrice} 
              onChange={onInputChange} 
              className="bg-white border border-gray-200 p-2 text-sm rounded-sm"
            />
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-200">
          <label className="text-[10px] text-gray-400 font-bold flex items-center gap-1 mb-2">
            <Box size={10}/> 拼团/福利
          </label>
          <AutoTextarea 
            name="bulkPrice" 
            value={formData.bulkPrice} 
            onChange={onInputChange} 
            className="bg-white border border-gray-200 p-2 text-xs mb-2 rounded-sm" 
            placeholder="拼团信息"
          />
          <AutoTextarea 
            name="extraBenefit" 
            value={formData.extraBenefit} 
            onChange={onInputChange} 
            className="bg-white border border-gray-200 p-2 text-xs rounded-sm" 
            placeholder="福利信息"
          />
        </div>
      </div>
    </div>

    <div className="bg-white border border-gray-200 shadow-sm p-5 space-y-4 rounded-sm animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center border-b border-gray-100 pb-2">
        <h3 className="text-xs font-bold text-gray-400 tracking-wider flex items-center gap-1">
          <Sparkles size={12}/> 抽奖贺信
        </h3>
      </div>
      <AutoTextarea 
        forwardedRef={textareaRef} 
        name="winnerTemplate" 
        value={formData.winnerTemplate} 
        onChange={onInputChange} 
        className="bg-gray-50 border border-gray-200 p-3 text-sm text-gray-700 rounded-sm" 
        rows={3}
      />
    </div>
    
    <div className="text-center text-xs text-gray-400 py-4">
      修改即自动保存到本机，下次打开还在
    </div>
  </>
);

export default ConfigTab;
