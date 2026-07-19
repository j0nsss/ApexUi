"use client";

import { useState, useCallback } from "react";
import { subDays, format } from "date-fns";
import { KpiCard } from "./kpi-card";
import { StepLineChart, HorizontalBarChart, GroupedBarChart, DonutChart } from "./admin-charts";
import { RealTimeCopyFeed } from "./realtime-feed";

interface KpiData {
  copyCount: number;
  pageviewCount: number;
  topComponent: string;
  dailyChartData: { event_date: string; copy_count: number }[];
  topComponentsData: { component_slug: string; copy_count: number; language: string }[];
  routeChartData: { route: string; count: number }[];
  categoryChartData: { name: string; value: number }[];
}

function AdminClient({ initialData }: { initialData: KpiData }) {
  const [from, setFrom] = useState(format(subDays(new Date(), 30), "yyyy-MM-dd"));
  const [to, setTo] = useState(format(new Date(), "yyyy-MM-dd"));
  const [data, setData] = useState<KpiData>(initialData);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (f: string, t: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?from=${f}&to=${t}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFilter = () => {
    fetchData(from, to);
  };

  const exportCsv = () => {
    let csv = "Metric,Value\n";
    csv += `Total Copy Events (30d),${data.copyCount}\n`;
    csv += `Total Page Views (30d),${data.pageviewCount}\n`;
    csv += `Most Copied Component,${data.topComponent}\n\n`;
    csv += "Date,Copy Count\n";
    for (const row of data.dailyChartData) {
      csv += `${row.event_date},${row.copy_count}\n`;
    }
    csv += "\nComponent,Copies\n";
    for (const row of data.topComponentsData) {
      csv += `${row.component_slug},${row.copy_count}\n`;
    }

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `apexui-analytics-${from}-to-${to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <label className="text-label text-secondary">
          From
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="ml-2 bg-code text-primary text-body border border-default px-2 py-1 focus:border-accent focus:outline-none"
          />
        </label>
        <label className="text-label text-secondary">
          To
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="ml-2 bg-code text-primary text-body border border-default px-2 py-1 focus:border-accent focus:outline-none"
          />
        </label>
        <button
          onClick={handleFilter}
          disabled={loading}
          className="px-3 py-1.5 text-label border border-default text-secondary hover:text-primary hover:border-accent transition-colors duration-75 disabled:opacity-40"
        >
          {loading ? "Loading..." : "Apply"}
        </button>
        <button
          onClick={exportCsv}
          className="ml-auto px-3 py-1.5 text-label border border-default text-secondary hover:text-primary hover:border-accent transition-colors duration-75"
        >
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard label="Total Copy Events" value={data.copyCount} />
        <KpiCard label="Total Page Views" value={data.pageviewCount} />
        <KpiCard label="Most Copied Component" value={data.topComponent} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StepLineChart data={data.dailyChartData} title="Copy Events Over Time" />
        <HorizontalBarChart data={data.topComponentsData} title="Top Components by Copy Count" />
        <GroupedBarChart data={data.routeChartData} title="Page Views by Route" />
        <DonutChart data={data.categoryChartData} title="Category Distribution" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RealTimeCopyFeed />
      </div>
    </div>
  );
}

export { AdminClient };
