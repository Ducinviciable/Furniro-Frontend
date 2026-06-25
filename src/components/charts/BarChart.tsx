import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BarChartProps {
  data: Record<string, string | number>[];
  xDataKey: string;
  barDataKey: string;
  height?: number;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  xDataKey,
  barDataKey,
  height = 300,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xDataKey} />
        <YAxis />
        <Tooltip />
        <Bar dataKey={barDataKey} fill="#4F46E5" />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
