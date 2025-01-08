export interface DailyData {
  trade_date: string;
  change_percent: number;
  open_price: number;
  close_price: number;
  high_price: number;
  low_price: number;
  volume: number;
  amount: number;
  turnover_rate: number;
}

export interface StockItem {
  stock_code: string;
  stock_name: string;
  total_change: number;
  daily_data: DailyData[];
  next_day_data: DailyData | null;
}

export interface StockRow {
  stock_code: string;
  stock_name: string;
  total_change: number;
  daily_data: string;
  next_day_data: DailyData | null;
}

export interface StockDayData {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
}
