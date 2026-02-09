import { useState, useEffect } from 'react';

export const useInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isAppMode, setIsAppMode] = useState(false);

  useEffect(() => {
    const checkStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true;
    setIsAppMode(checkStandalone);

    const handleInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallPrompt(null);
      }
    } else {
      alert("👉 请点击浏览器右上角的菜单(三个点或分享图标)\n\n👉 然后选择「添加到主屏幕」或「安装应用」即可！");
    }
  };

  return { installPrompt, isAppMode, handleInstall };
};
