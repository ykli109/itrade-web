import { DailyData } from "@/types/stock";
import ReactECharts from "echarts-for-react";

interface MiniKLineChartProps {
  data: DailyData;
}

export function MiniKLineChart({ data }: MiniKLineChartProps) {
  const option = {
    animation: false,
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    xAxis: {
      show: false,
      type: "category",
      data: [data.trade_date],
    },
    yAxis: {
      show: false,
      scale: true,
    },
    series: [
      {
        type: "candlestick",
        data: [
          [data.open_price, data.close_price, data.low_price, data.high_price],
        ],
        itemStyle: {
          color: data.change_percent >= 0 ? "#ef5350" : "#26a69a",
          color0: "#26a69a",
          borderColor: data.change_percent >= 0 ? "#ef5350" : "#26a69a",
          borderColor0: "#26a69a",
        },
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: "100%", width: "100%" }}
      opts={{ renderer: "svg" }}
    />
  );
}
