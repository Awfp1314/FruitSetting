import { useState, useEffect } from 'react';
import { CURRENT_VERSION } from '../constants/changelog';

const VERSION_KEY = 'app_version';

export const useVersionCheck = () => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newVersion, setNewVersion] = useState(null);

  useEffect(() => {
    const savedVersion = localStorage.getItem(VERSION_KEY);

    // 如果没有保存的版本，或者版本不同，显示更新弹窗
    if (!savedVersion || savedVersion !== CURRENT_VERSION) {
      setNewVersion(CURRENT_VERSION);
      setShowUpdateModal(true);
    }
  }, []);

  const closeUpdateModal = () => {
    // 保存当前版本号
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    setShowUpdateModal(false);
  };

  return {
    showUpdateModal,
    newVersion,
    closeUpdateModal,
  };
};
