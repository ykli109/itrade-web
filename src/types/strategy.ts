export interface StrategyCondition {
  id: string;
  type: 'price' | 'volume' | 'drawdown';
  params: {
    days?: number;
    percentage?: number;
    compareRatio?: number;
    compareDays?: number;
  };
}

export interface Strategy {
  id: string;
  name: string;
  conditions: StrategyCondition[];
} 