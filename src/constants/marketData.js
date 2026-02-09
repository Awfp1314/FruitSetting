// 正宁县赶集数据（按行政区划分类）
export const MARKET_SCHEDULE = [
  // 镇
  {
    name: '山河镇(县城)',
    shortName: '县城',
    days: [1, 5, 8],
    color: 'bg-blue-500',
    type: 'town',
  },
  {
    name: '榆林子镇',
    shortName: '榆林子',
    days: [2, 6, 9],
    color: 'bg-orange-500',
    type: 'town',
  },
  {
    name: '宫河镇',
    shortName: '宫河',
    days: [3, 7, 10],
    color: 'bg-green-500',
    type: 'town',
  },
  {
    name: '周家镇',
    shortName: '周家',
    days: [1, 4, 8],
    color: 'bg-indigo-500',
    type: 'town',
  },
  {
    name: '永和镇',
    shortName: '永和',
    days: [4, 7, 10],
    color: 'bg-red-500',
    type: 'town',
  },
  {
    name: '永正镇',
    shortName: '永正',
    days: [3, 7, 10],
    color: 'bg-teal-500',
    type: 'town',
  },
  {
    name: '湫头镇',
    shortName: '湫头',
    days: [3, 6, 9],
    color: 'bg-purple-500',
    type: 'town',
  },
  // 西坡镇、三嘉乡、五顷塬回族乡 信息暂缺
];

// 获取某个农历日期有集的地方
export const getMarketsForDay = (lunarDay) => {
  const day = lunarDay % 10; // 只看个位数（取尾数）
  return MARKET_SCHEDULE.filter((market) => market.days.includes(day));
};
