import { DailyData } from "@/types/stock";
import ReactECharts from "echarts-for-react";
import { useState } from "react";

interface TrendChartProps {
  dailyData: DailyData[];
  totalRise?: number;
}

export function TrendChart({ dailyData }: TrendChartProps) {
  const [isZoomIn, setIsZoomIn] = useState(false);
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    legend: {
      data: ["K线", "累计涨幅"],
    },
    grid: {
      left: "10%",
      right: "10%",
      bottom: "15%",
    },
    xAxis: {
      type: "category",
      data: dailyData.map((item) => item.trade_date),
      scale: true,
    },
    yAxis: [
      {
        type: "value",
        name: "价格",
        position: "left",
        scale: true,
      },
      {
        type: "value",
        name: "涨幅(%)",
        position: "right",
        scale: true,
      },
    ],
    series: [
      {
        name: "K线",
        type: "candlestick",
        data: dailyData.map((item) => [
          item.open_price,
          item.close_price,
          item.low_price,
          item.high_price,
        ]),
        itemStyle: {
          color: "#ef5350",
          color0: "#26a69a",
          borderColor: "#ef5350",
          borderColor0: "#26a69a",
        },
      },
      {
        name: "累计涨幅",
        type: "line",
        yAxisIndex: 1,
        data: dailyData.reduce(
          (acc: number[], curr: DailyData, index: number) => {
            const prevValue = index > 0 ? 1 + acc[index - 1] / 100 : 1;
            const currentValue = prevValue * (1 + curr.change_percent / 100);
            acc.push(Number(((currentValue - 1) * 100).toFixed(2)));
            return acc;
          },
          []
        ),
        lineStyle: {
          color: "#FF8A65",
        },
      },
    ],
  };

  return (
    <div
      style={{
        margin: isZoomIn ? "0" : "-50px 0",
        height: "200px",
        transform: isZoomIn ? "scale(1)" : "scale(0.5)",
      }}
      onClick={() => setIsZoomIn(!isZoomIn)}
    >
      <ReactECharts option={option} style={{ height: "100%" }} />
    </div>
  );
}
