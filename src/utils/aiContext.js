import { dataManager } from './dataManager';
import { getLunarInfo } from './lunar';

// 收集用户的生意数据，构建 AI 上下文
export const collectBusinessContext = (markets = [], todayInfo = null) => {
  if (!todayInfo) todayInfo = getLunarInfo();

  const accountData = dataManager.load();
  const { inventory = [], sales = [], restDays = [] } = accountData;

  // 活跃库存
  const activeInventory = inventory.filter((inv) => inv.status === 'active' && inv.remainBoxes > 0);

  // 最近7天销售
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentSales = sales.filter((s) => new Date(s.date) >= sevenDaysAgo);

  // 最近7天的休息日
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
  const recentRestDays = restDays.filter((d) => d >= sevenDaysAgoStr);

  // 计算实际有销售的天数
  const saleDates = new Set(recentSales.map((s) => s.date));
  const actualSaleDays = saleDates.size;
  const actualRestDays = recentRestDays.length;

  // 按地点统计
  const salesByLocation = {};
  recentSales.forEach((sale) => {
    if (!salesByLocation[sale.location]) {
      salesByLocation[sale.location] = { count: 0, income: 0, profit: 0, boxes: 0 };
    }
    salesByLocation[sale.location].count++;
    salesByLocation[sale.location].income += sale.totalIncome || 0;
    salesByLocation[sale.location].profit += sale.profit || 0;
    salesByLocation[sale.location].boxes += sale.sellBoxes || 0;
  });

  // 按日期统计
  const salesByDate = {};
  recentSales.forEach((sale) => {
    if (!salesByDate[sale.date]) {
      salesByDate[sale.date] = { income: 0, profit: 0, boxes: 0 };
    }
    salesByDate[sale.date].income += sale.totalIncome || 0;
    salesByDate[sale.date].profit += sale.profit || 0;
    salesByDate[sale.date].boxes += sale.sellBoxes || 0;
  });

  const totalProfit = recentSales.reduce((sum, s) => sum + (s.profit || 0), 0);
  const totalIncome = recentSales.reduce((sum, s) => sum + (s.totalIncome || 0), 0);
  const totalBoxes = recentSales.reduce((sum, s) => sum + (s.sellBoxes || 0), 0);

  // 明天集市
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowLunar = getLunarInfo(tomorrow);
  const tomorrowDay = tomorrowLunar.lunarDay % 10;
  const savedMarkets = localStorage.getItem('marketSchedule');
  const allMarkets = savedMarkets ? JSON.parse(savedMarkets) : [];
  const tomorrowMarkets = allMarkets.filter((m) => m.days.includes(tomorrowDay));

  // 构建库存信息
  let inventoryInfo = '暂无库存';
  if (activeInventory.length > 0) {
    const today = new Date();
    inventoryInfo = activeInventory
      .map((inv) => {
        const daysSince = Math.floor((today - new Date(inv.date)) / (1000 * 60 * 60 * 24));
        const soldBoxes = inv.boxes - inv.remainBoxes;
        const soldPercent = inv.boxes > 0 ? Math.round((soldBoxes / inv.boxes) * 100) : 0;
        return `- ${inv.fruit}：进了${inv.boxes}框，已卖${soldBoxes}框(${soldPercent}%)，剩${inv.remainBoxes}框，进货${daysSince}天了，成本¥${inv.pricePerBox}/框`;
      })
      .join('\n');
  }

  // 销售速度（用实际有销售的天数计算）
  let salesPace = '';
  if (activeInventory.length > 0 && recentSales.length > 0 && actualSaleDays > 0) {
    const avgBoxesPerDay = totalBoxes / actualSaleDays;
    const totalRemain = activeInventory.reduce((sum, inv) => sum + inv.remainBoxes, 0);
    const estDays = avgBoxesPerDay > 0 ? Math.round(totalRemain / avgBoxesPerDay) : 0;
    salesPace = `\n近7天内实际出摊${actualSaleDays}天，日均卖${avgBoxesPerDay.toFixed(1)}框，剩余${totalRemain}框按这个速度大约还需${estDays}个出摊日卖完`;
  }

  let salesDetail = '';
  if (Object.keys(salesByDate).length > 0) {
    salesDetail = Object.entries(salesByDate)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 5)
      .map(([date, s]) => `- ${date}：卖了${s.boxes}框，收入¥${s.income}，利润¥${s.profit}`)
      .join('\n');
  }

  let locationDetail = '';
  if (Object.keys(salesByLocation).length > 0) {
    locationDetail = Object.entries(salesByLocation)
      .sort((a, b) => b[1].profit - a[1].profit)
      .map(([loc, s]) => `- ${loc}：去了${s.count}次，共卖${s.boxes}框，总利润¥${s.profit}`)
      .join('\n');
  }

  const todayMarketNames = markets.map((m) => m.name).join('、');
  const tomorrowMarketNames = tomorrowMarkets.map((m) => m.name).join('、');

  return `当前日期：${todayInfo.solarDate.toLocaleDateString('zh-CN')}，农历${todayInfo.lunarDateStr}，星期${todayInfo.weekDay}
地区：甘肃省庆阳市正宁县

今日集市：${markets.length > 0 ? todayMarketNames : '今天没有集市'}
明日集市（农历${tomorrowLunar.lunarDateStr}，星期${tomorrowLunar.weekDay}）：${tomorrowMarkets.length > 0 ? tomorrowMarketNames : '明天没有集市'}

当前库存：
${inventoryInfo}

近期销售（7天内出摊${actualSaleDays}天，休息${actualRestDays}天）：
- 总收入：¥${totalIncome}，总利润：¥${totalProfit}，共卖出${totalBoxes}框${salesPace}
${salesDetail ? '\n按日期：\n' + salesDetail : ''}
${locationDetail ? '\n按地点：\n' + locationDetail : ''}
${recentRestDays.length > 0 ? '\n休息日：' + recentRestDays.join('、') : ''}`;
};
