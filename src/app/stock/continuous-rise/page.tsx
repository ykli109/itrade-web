"use client";

import { useEffect, useState } from "react";
import { TrendChart } from "@/components/stock/TrendChart";
import { StockItem } from "@/types/stock";
import { MiniKLineChart } from "@/components/stock/MiniKLineChart";

export default function ContinuousRisePage() {
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: getDefaultStartDate(), // 默认一个月前
    endDate: new Date().toISOString().split("T")[0], // 今天
  });

  // 获取默认开始日期（一个月前）
  function getDefaultStartDate() {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split("T")[0];
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days, dateRange.startDate, dateRange.endDate]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `/api/stock/continuous-rise?days=${days}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
      );
      if (!response.ok) {
        throw new Error("获取数据失败");
      }
      const { data } = await response.json();
      console.log(data);
      setStocks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "未知错误");
    } finally {
      setLoading(false);
    }
  };

  // 过滤和分页逻辑
  const filteredStocks = stocks.filter(
    (stock) =>
      stock.stock_code.includes(searchText) ||
      stock.stock_name.includes(searchText)
  );

  const totalPages = Math.ceil(filteredStocks.length / pageSize);
  const paginatedStocks = filteredStocks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return <div className="text-center p-4">加载中...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">连续上涨股票</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="startDate">开始日期：</label>
            <input
              type="date"
              id="startDate"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                }))
              }
              max={dateRange.endDate}
              className="border rounded px-2 py-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="endDate">结束日期：</label>
            <input
              type="date"
              id="endDate"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange((prev) => ({
                  ...prev,
                  endDate: e.target.value,
                }))
              }
              min={dateRange.startDate}
              max={new Date().toISOString().split("T")[0]}
              className="border rounded px-2 py-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="days">连续上涨天数：</label>
            <select
              id="days"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {[3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
                <option key={d} value={d}>
                  {d}日
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="搜索代码或名称"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">代码</th>
              <th className="border border-gray-300 px-4 py-2">名称</th>
              <th className="border border-gray-300 px-4 py-2">累计涨幅</th>
              <th className="border border-gray-300 px-4 py-2 w-[500px]">
                走势图
              </th>
              <th className="border border-gray-300 px-4 py-2 w-[200px]">
                次日表现
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedStocks.map((stock) => (
              <tr key={stock.stock_code}>
                <td className="border border-gray-300 px-4 py-2">
                  {stock.stock_code}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {stock.stock_name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {stock.total_change}%
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <TrendChart dailyData={stock.daily_data} />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {stock.next_day_data ? (
                    <div className="flex items-center justify-between gap-4">
                      {/* 迷你K线图 */}
                      <div className="w-24 h-16">
                        <MiniKLineChart data={stock.next_day_data} />
                      </div>
                      {/* 数字展示 */}
                      <div className="text-xs">
                        <div
                          className={`font-bold text-base mb-1 ${
                            stock.next_day_data.change_percent >= 0
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {stock.next_day_data.change_percent?.toFixed(2)}%
                        </div>
                        <div className="grid grid-cols-2 gap-x-2">
                          <div>开:{stock.next_day_data.open_price}</div>
                          <div>收:{stock.next_day_data.close_price}</div>
                          <div>高:{stock.next_day_data.high_price}</div>
                          <div>低:{stock.next_day_data.low_price}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center">暂无数据</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页控件 */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          上一页
        </button>
        <span>
          第 {currentPage} 页，共 {totalPages} 页
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          下一页
        </button>
      </div>
    </div>
  );
}
