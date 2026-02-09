// PWA 数据管理器 - 多重备份保护
class AccountDataManager {
  constructor() {
    this.storageKey = 'accountRecords';
    this.init();
  }

  init() {
    this.autoRecover();
    window.addEventListener('beforeunload', () => this.emergencyBackup());
  }

  // 保存数据（自动多重备份）
  save(data) {
    const dataStr = JSON.stringify(data);
    const timestamp = Date.now();

    try {
      localStorage.setItem(this.storageKey, dataStr);
      localStorage.setItem(`${this.storageKey}_backup`, dataStr);
      this.saveDailyBackup(dataStr);
      this.saveTimestampBackup(dataStr);

      const checksum = this.calculateChecksum(dataStr);
      localStorage.setItem(`${this.storageKey}_checksum`, checksum);
      localStorage.setItem('lastSaveTime', timestamp);

      return true;
    } catch (error) {
      console.error('保存失败:', error);
      return false;
    }
  }

  // 加载数据
  load() {
    try {
      let dataStr = localStorage.getItem(this.storageKey);
      if (!this.validateData(dataStr)) {
        dataStr = this.autoRecover();
      }
      return JSON.parse(dataStr);
    } catch {
      return { inventory: [], sales: [] };
    }
  }

  // 自动恢复
  autoRecover() {
    const backups = [
      this.storageKey,
      `${this.storageKey}_backup`,
      `${this.storageKey}_ts1`,
      `${this.storageKey}_daily`,
      `${this.storageKey}_emergency`,
    ];

    for (const key of backups) {
      const dataStr = localStorage.getItem(key);
      if (this.validateData(dataStr)) {
        localStorage.setItem(this.storageKey, dataStr);
        return dataStr;
      }
    }

    return JSON.stringify({ inventory: [], sales: [] });
  }

  validateData(dataStr) {
    if (!dataStr) return false;
    try {
      const data = JSON.parse(dataStr);
      // 兼容新旧数据格式
      return (
        data &&
        (Array.isArray(data.records) || Array.isArray(data.inventory) || Array.isArray(data.sales))
      );
    } catch {
      return false;
    }
  }

  saveDailyBackup(dataStr) {
    const today = new Date().toDateString();
    const last = localStorage.getItem('lastDailyBackup');
    if (last !== today) {
      localStorage.setItem(`${this.storageKey}_daily`, dataStr);
      localStorage.setItem('lastDailyBackup', today);
    }
  }

  saveTimestampBackup(dataStr) {
    localStorage.setItem(`${this.storageKey}_ts1`, dataStr);
  }

  emergencyBackup() {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      localStorage.setItem(`${this.storageKey}_emergency`, data);
    }
  }

  calculateChecksum(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash = hash & hash;
    }
    return hash.toString();
  }
}

export const dataManager = new AccountDataManager();
