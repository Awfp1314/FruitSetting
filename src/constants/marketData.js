// 正宁县赶集数据
export const MARKET_SCHEDULE = [
  {
    name: '县城',
    days: [1, 5, 8],
    color: 'bg-blue-500',
  },
  {
    name: '周家',
    days: [1, 5, 8],
    color: 'bg-blue-500',
  },
  {
    name: '榆林子',
    days: [2, 6, 9],
    color: 'bg-orange-500',
  },
  {
    name: '宫河',
    days: [3, 7, 10],
    color: 'bg-green-500',
  },
  {
    name: '永正',
    days: [3, 7, 10],
    color: 'bg-green-500',
  },
  {
    name: '揪头',
    days: [3, 6, 9],
    color: 'bg-purple-500',
  },
  {
    name: '永和',
    days: [4, 7, 10],
    color: 'bg-red-500',
  },
];

// 获取某个农历日期有集的地方
export const getMarketsForDay = (lunarDay) => {
  const day = lunarDay % 10; // 只看个位数
  return MARKET_SCHEDULE.filter((market) => market.days.includes(day));
};
