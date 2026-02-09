export const getTodayDateStr = () => {
  const date = new Date();
  return `今天（${date.toLocaleDateString('zh-CN', { 
    month: 'numeric', 
    day: 'numeric', 
    weekday: 'long' 
  })}）全天`;
};

export const getCurrentTime = () => {
  return new Date().toLocaleTimeString('zh-CN', { hour12: false });
};
