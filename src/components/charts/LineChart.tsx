import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface LineChartProps {
  data: Record<string, string | number>[];
  xDataKey: string;
  lineDataKey: string;
  height?: number;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  xDataKey,
  lineDataKey,
  height = 300,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xDataKey} />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={lineDataKey} stroke="#4F46E5" />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
