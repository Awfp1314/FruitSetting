import { Lunar, Solar } from 'lunar-javascript';

// 获取指定日期的农历信息
export const getLunarInfo = (date = new Date()) => {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();

  return {
    lunarDay: lunar.getDay(),
    lunarMonth: lunar.getMonth(),
    lunarYear: lunar.getYear(),
    lunarDateStr: `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    solarDate: date,
    weekDay: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
  };
};

// 获取未来 N 天的农历信息
export const getNextDaysLunar = (days = 7) => {
  const result = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    result.push(getLunarInfo(date));
  }

  return result;
};
