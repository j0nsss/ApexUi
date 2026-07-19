"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartTile } from "./chart-tile";

const axisColor = "#F5F2EB";
const gridColor = "#262930";
const accentColor = "#A31D1D";
const categoryColors = ["#A31D1D", "#1D3A8A", "#1D8A4A", "#8A6A1D", "#6B21A8", "#0D9488"];

function StepLineChart({
  data,
  title,
}: {
  data: { event_date: string; copy_count: number }[];
  title: string;
}) {
  return (
    <ChartTile title={title}>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="0" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="event_date"
            tick={{ fill: axisColor, fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: gridColor }}
            tickFormatter={(v: string) => v?.slice(5) ?? ""}
          />
          <YAxis
            tick={{ fill: axisColor, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={32}
          />
          <Tooltip
            contentStyle={{
              background: "#1E222B",
              border: "1px solid #262930",
              borderRadius: 0,
              fontSize: 12,
              color: "#F5F2EB",
            }}
          />
          <Line
            type="step"
            dataKey="copy_count"
            stroke={accentColor}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3, fill: accentColor }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartTile>
  );
}

function HorizontalBarChart({
  data,
  title,
}: {
  data: { component_slug: string; copy_count: number }[];
  title: string;
}) {
  return (
    <ChartTile title={title}>
      <ResponsiveContainer width="100%" height={Math.max(160, data.length * 28)}>
        <BarChart data={data} layout="vertical" margin={{ left: 100, right: 8, top: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="0" stroke={gridColor} horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: axisColor, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            dataKey="component_slug"
            type="category"
            tick={{ fill: axisColor, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={96}
          />
          <Tooltip
            contentStyle={{
              background: "#1E222B",
              border: "1px solid #262930",
              borderRadius: 0,
              fontSize: 12,
              color: "#F5F2EB",
            }}
          />
          <Bar dataKey="copy_count" fill={accentColor} barSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </ChartTile>
  );
}

function GroupedBarChart({
  data,
  title,
}: {
  data: { route: string; count: number }[];
  title: string;
}) {
  return (
    <ChartTile title={title}>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="0" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="route"
            tick={{ fill: axisColor, fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: gridColor }}
          />
          <YAxis
            tick={{ fill: axisColor, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={32}
          />
          <Tooltip
            contentStyle={{
              background: "#1E222B",
              border: "1px solid #262930",
              borderRadius: 0,
              fontSize: 12,
              color: "#F5F2EB",
            }}
          />
          <Bar dataKey="count" fill={accentColor} barSize={20} radius={0} />
        </BarChart>
      </ResponsiveContainer>
    </ChartTile>
  );
}

function DonutChart({ data, title }: { data: { name: string; value: number }[]; title: string }) {
  return (
    <ChartTile title={title}>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={categoryColors[i % categoryColors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#1E222B",
              border: "1px solid #262930",
              borderRadius: 0,
              fontSize: 12,
              color: "#F5F2EB",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartTile>
  );
}

export { StepLineChart, HorizontalBarChart, GroupedBarChart, DonutChart };
