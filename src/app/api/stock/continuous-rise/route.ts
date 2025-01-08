import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { StockItem, StockRow } from "@/types/stock";

/*
数据库字段：
{
    'id': '唯一标识(交易日期_股票代码)',
    'trade_date': '交易日期',
    'stock_code': '股票代码',
    'stock_name': '股票名称',
    'open_price': '开盘价',
    'high_price': '最高价',
    'low_price': '最低价', 
    'close_price': '收盘价',
    'volume': '成交量',
    'amount': '成交额',
    'amplitude': '振幅',
    'change_percent': '涨跌幅',
    'change_amount': '涨跌额',
    'turnover_rate': '换手率',
    'prev_close': '前一日收盘价',
    'is_up_limit': '是否涨停',
    'is_down_limit': '是否跌停',
    'created_at': '创建时间'
}
*/

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = Number(searchParams.get("days")) || 5;
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    await connection.execute("SET SESSION group_concat_max_len = 1000000;");

    const query = `
      WITH RankedData AS (
        SELECT 
          t1.stock_code,
          t1.stock_name,
          t1.trade_date,
          t1.change_percent,
          t1.open_price,
          t1.close_price,
          t1.high_price,
          t1.low_price,
          t1.volume,
          t1.amount,
          t1.turnover_rate,
          ROW_NUMBER() OVER (PARTITION BY t1.stock_code ORDER BY t1.trade_date) - 
          ROW_NUMBER() OVER (PARTITION BY t1.stock_code, CASE WHEN t1.change_percent > 0 THEN 1 ELSE 0 END ORDER BY t1.trade_date) as grp
        FROM stock_daily_trading t1
        WHERE t1.trade_date >= ?
        AND t1.trade_date <= ?
      ),
      ConsecutiveDays AS (
        SELECT 
          stock_code,
          stock_name,
          MAX(trade_date) as last_rise_date,
          CONCAT(
            '[',
            GROUP_CONCAT(
              JSON_OBJECT(
                'trade_date', trade_date,
                'change_percent', change_percent,
                'open_price', open_price,
                'close_price', close_price,
                'high_price', high_price,
                'low_price', low_price,
                'volume', volume,
                'amount', amount,
                'turnover_rate', turnover_rate
              )
              ORDER BY trade_date
            ),
            ']'
          ) as daily_data,
          COUNT(*) as consecutive_days,
          (EXP(SUM(LN(1 + change_percent/100))) - 1) * 100 as total_change
        FROM RankedData
        WHERE change_percent > 0
        GROUP BY stock_code, stock_name, grp
        HAVING COUNT(*) >= ?
      ),
      NextTradingDay AS (
        SELECT 
          c.stock_code,
          c.stock_name,
          c.total_change,
          c.daily_data,
          c.last_rise_date,
          MIN(td.trade_date) as next_trade_date
        FROM ConsecutiveDays c
        JOIN stock_trade_date td ON td.trade_date > c.last_rise_date
        GROUP BY c.stock_code, c.stock_name, c.total_change, c.daily_data, c.last_rise_date
      )
      SELECT 
        n.stock_code,
        n.stock_name,
        n.total_change,
        n.daily_data,
        JSON_OBJECT(
          'trade_date', t.trade_date,
          'change_percent', t.change_percent,
          'open_price', t.open_price,
          'close_price', t.close_price,
          'high_price', t.high_price,
          'low_price', t.low_price,
          'volume', t.volume,
          'amount', t.amount,
          'turnover_rate', t.turnover_rate
        ) as next_day_data
      FROM NextTradingDay n
      LEFT JOIN stock_daily_trading t ON n.stock_code = t.stock_code 
        AND t.trade_date = n.next_trade_date
      ORDER BY n.total_change DESC;
    `;

    const [rows] = await connection.execute(query, [startDate, endDate, days]);
    await connection.end();

    console.log("rows", rows);

    const formattedData = (rows as StockRow[]).map((row) => ({
      stock_code: row.stock_code,
      stock_name: row.stock_name,
      total_change: Number(Number(row.total_change).toFixed(2)),
      daily_data: safeParse(row.daily_data) || [],
      next_day_data: row.next_day_data || null,
    })) as StockItem[];

    return NextResponse.json({ data: formattedData });
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json({ error: "查询数据失败" }, { status: 500 });
  }
}

export const safeParse = (data: string) => {
  try {
    return JSON.parse(data);
    // eslint-disable-next-line
  } catch (e: any) {
    console.log(data, e);
    return null;
  }
};
