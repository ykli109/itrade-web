import { StockDayData } from "@/types/stock";
import { Strategy } from "@/types/strategy";

export class StockStrategyCalculator {
  constructor(private stockData: Record<string, StockDayData[]>) {}

  // 计算最大回撤
  private calculateMaxDrawdown(prices: number[]): number {
    let maxSoFar = prices[0];
    let maxDrawdown = 0;

    for (const price of prices) {
      if (price > maxSoFar) {
        maxSoFar = price;
      }
      const drawdown = (maxSoFar - price) / maxSoFar;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }

    return maxDrawdown * 100;
  }

  // 计算价格上涨百分比
  private calculatePriceIncrease(prices: number[]): number {
    return ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100;
  }

  // 计算成交量比率
  private calculateVolumeRatio(volumes: number[], recentDays: number, compareDays: number): number {
    const recentAvg = volumes.slice(-recentDays).reduce((a, b) => a + b, 0) / recentDays;
    const compareAvg = volumes.slice(-compareDays - recentDays, -recentDays).reduce((a, b) => a + b, 0) / compareDays;
    return compareAvg === 0 ? 0 : recentAvg / compareAvg;
  }

  // 找到符合条件的股票
  findMatchingStocks(strategy: Strategy): string[] {
    const matchingStocks: string[] = [];

    for (const [stockCode, data] of Object.entries(this.stockData)) {
      let meetsAllConditions = true;

      for (const condition of strategy.conditions) {
        const prices = data.map(d => d.close);
        const volumes = data.map(d => d.volume);

        switch (condition.type) {
          case 'price':
            if (condition.params.days && condition.params.percentage) {
              const increase = this.calculatePriceIncrease(prices.slice(-condition.params.days));
              if (increase < condition.params.percentage) {
                meetsAllConditions = false;
              }
            }
            break;

          case 'drawdown':
            if (condition.params.days && condition.params.percentage) {
              const drawdown = this.calculateMaxDrawdown(prices.slice(-condition.params.days));
              if (drawdown > condition.params.percentage) {
                meetsAllConditions = false;
              }
            }
            break;

          case 'volume':
            if (condition.params.days && condition.params.compareDays && condition.params.compareRatio) {
              const volumeRatio = this.calculateVolumeRatio(
                volumes,
                condition.params.days,
                condition.params.compareDays
              );
              if (volumeRatio < condition.params.compareRatio) {
                meetsAllConditions = false;
              }
            }
            break;
        }

        if (!meetsAllConditions) break;
      }

      if (meetsAllConditions) {
        matchingStocks.push(stockCode);
      }
    }

    return matchingStocks;
  }
} 