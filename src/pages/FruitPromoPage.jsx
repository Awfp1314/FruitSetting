import { useState, useEffect, useRef } from 'react';
import StatusBar from '../components/StatusBar';
import Header from '../components/Header';
import ConfigTab from '../components/ConfigTab';
import PreviewTab from '../components/PreviewTab';
import { useFormData } from '../hooks/useFormData';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { copyToClipboard } from '../utils/clipboard';
import { useToast } from '../components/Toast';
import { getTodayDateStr } from '../utils/date';

const FruitPromoPage = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('config');
  const { showToast } = useToast();
  const [currentTime, setCurrentTime] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [latency, setLatency] = useState(24);
  const [copyStatus, setCopyStatus] = useState(0);
  const textareaRef = useRef(null);

  const { formData, handleInputChange } = useFormData();
  const { installPrompt, isAppMode, handleInstall } = useInstallPrompt();

  useEffect(() => {
    const updateTime = () => {
      const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
      setCurrentTime(time);
      if (window.navigator.onLine) {
        setLatency(Math.floor(Math.random() * (45 - 20) + 20));
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    const handleNet = () => setIsOnline(window.navigator.onLine);
    window.addEventListener('online', handleNet);
    window.addEventListener('offline', handleNet);

    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleNet);
      window.removeEventListener('offline', handleNet);
    };
  }, []);

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

  const handleCopy = (text, typeId) => {
    copyToClipboard(
      text,
      () => {
        setCopyStatus(typeId);
        setTimeout(() => setCopyStatus(0), 2000);
      },
      (msg) => {
        showToast(msg, 'error');
      }
    );
  };

  return (
    <div className="bg-[#F0F2F5] font-sans text-slate-900">
      <StatusBar isOnline={isOnline} latency={latency} />

      <Header
        currentTime={currentTime}
        isAppMode={isAppMode}
        installPrompt={installPrompt}
        onInstall={() => handleInstall(showToast)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showBackButton={true}
        onBack={onBack}
      />

      <div className="p-4 space-y-4 pb-10">
        {activeTab === 'config' ? (
          <ConfigTab
            formData={formData}
            onInputChange={handleInputChange}
            textareaRef={textareaRef}
          />
        ) : (
          <PreviewTab
            fullText={generateFullText()}
            winnerText={formData.winnerTemplate}
            copyStatus={copyStatus}
            onCopy={handleCopy}
          />
        )}
      </div>
    </div>
  );
};

export default FruitPromoPage;
