import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

function loadEnv() {
  const env = fs.readFileSync(path.resolve(__dirname, "../.env.local"), "utf8");
  const vars: Record<string, string> = {};
  env
    .split("\n")
    .filter((l) => l.trim() && !l.startsWith("#"))
    .forEach((l) => {
      const [k, ...v] = l.split("=");
      vars[k.trim()] = v.join("=").trim();
    });
  return vars;
}

const env = loadEnv();
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!);

interface ComponentSeed {
  slug: string;
  name: string;
  description: string;
  category: "table" | "chart" | "navigation" | "bento";
  tags: string[];
  bento_size: "1x1" | "2x1" | "2x2";
  sort_order: number;
  customizer_schema: Record<string, unknown>;
  random_data_schema?: Record<string, unknown>;
  variants: { language: string; code_template: string; display_order: number }[];
}

const components: ComponentSeed[] = [
  // ========================
  // TABLE CATEGORY
  // ========================
  {
    slug: "data-table-default",
    name: "Data Table — Default",
    description: "Full-featured data table with pagination, sorting, and row hover states.",
    category: "table",
    tags: ["sortable", "paginated", "responsive"],
    bento_size: "2x2",
    sort_order: 10,
    customizer_schema: {
      params: [
        {
          key: "row_height",
          label: "Row Height (px)",
          type: "range_slider",
          default: 48,
          min: 36,
          max: 72,
          step: 4,
        },
        {
          key: "accent_color",
          label: "Accent Color",
          type: "color_picker",
          default: "#A31D1D",
          palette: ["#A31D1D", "#1D3A8A", "#1D8A4A", "#8A6A1D", "#6B21A8", "#0D9488"],
        },
        { key: "show_pagination", label: "Show Pagination", type: "toggle_switch", default: true },
        { key: "striped_rows", label: "Striped Rows", type: "toggle_switch", default: false },
      ],
    },
    random_data_schema: {
      columns: [
        { name: "Name", type: "string" },
        { name: "Email", type: "string" },
        { name: "Role", type: "string" },
        { name: "Status", type: "string" },
        { name: "Last Active", type: "date" },
      ],
      row_count: { min: 10, max: 20 },
    },
    variants: [
      {
        language: "html",
        display_order: 1,
        code_template: `<table class="w-full border-collapse" style="font-size: 0.875rem;">
  <thead>
    <tr style="height: {{row_height}}px; border-bottom: 1px solid #262930;">
      <th class="text-left px-4 text-secondary font-medium">Name</th>
      <th class="text-left px-4 text-secondary font-medium">Email</th>
      <th class="text-left px-4 text-secondary font-medium">Role</th>
      <th class="text-left px-4 text-secondary font-medium">Status</th>
    </tr>
  </thead>
  <tbody>
    {{#each rows}}
    <tr style="height: {{row_height}}px; border-bottom: 1px solid #262930;"
        class="hover:bg-code transition-colors duration-75">
      <td class="px-4 text-primary">{{Name}}</td>
      <td class="px-4 text-secondary">{{Email}}</td>
      <td class="px-4 text-secondary">{{Role}}</td>
      <td class="px-4"><span style="color: {{accent_color}};">{{Status}}</span></td>
    </tr>
    {{/each}}
  </tbody>
</table>
{{#if show_pagination}}
<div class="flex items-center justify-between px-4 py-3 border-t border-default">
  <span class="text-sm text-secondary">Page 1 of 5</span>
  <div class="flex gap-2">
    <button class="px-3 py-1 border border-default text-secondary hover:text-primary">Previous</button>
    <button class="px-3 py-1 border border-default text-secondary hover:text-primary">Next</button>
  </div>
</div>
{{/if}}`,
      },
      {
        language: "react-tsx",
        display_order: 2,
        code_template: `import { useState } from 'react';

interface Row {
  name: string;
  email: string;
  role: string;
  status: string;
}

interface DataTableProps {
  rows?: Row[];
  rowHeight?: number;
  accentColor?: string;
  showPagination?: boolean;
  stripedRows?: boolean;
}

const defaultRows: Row[] = [
  { name: 'Alex Morgan', email: 'alex@example.com', role: 'Developer', status: 'Active' },
  { name: 'Priya Sharma', email: 'priya@example.com', role: 'Designer', status: 'Active' },
  { name: 'Jordan Lee', email: 'jordan@example.com', role: 'PM', status: 'Away' },
];

export function DataTable({
  rows = defaultRows,
  rowHeight = {{row_height}},
  accentColor = '{{accent_color}}',
  showPagination = {{show_pagination}},
  stripedRows = {{striped_rows}},
}: DataTableProps) {
  const [page, setPage] = useState(1);

  return (
    <div>
      <table className="w-full border-collapse" style={{ fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ height: rowHeight, borderBottom: '1px solid #262930' }}>
            <th className="text-left px-4 text-secondary font-medium">Name</th>
            <th className="text-left px-4 text-secondary font-medium">Email</th>
            <th className="text-left px-4 text-secondary font-medium">Role</th>
            <th className="text-left px-4 text-secondary font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              style={{
                height: rowHeight,
                borderBottom: '1px solid #262930',
                background: stripedRows && i % 2 ? 'var(--color-bg-code)' : undefined,
              }}
              className="hover:bg-code transition-colors duration-75"
            >
              <td className="px-4 text-primary">{row.name}</td>
              <td className="px-4 text-secondary">{row.email}</td>
              <td className="px-4 text-secondary">{row.role}</td>
              <td className="px-4" style={{ color: accentColor }}>{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showPagination && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-default">
          <span className="text-sm text-secondary">Page {page} of 5</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              className="px-3 py-1 border border-default text-secondary hover:text-primary"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(5, page + 1))}
              className="px-3 py-1 border border-default text-secondary hover:text-primary"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}`,
      },
    ],
  },

  {
    slug: "data-table-compact",
    name: "Data Table — Compact",
    description: "Space-efficient data table variant with minimal padding and condensed rows.",
    category: "table",
    tags: ["compact", "dense", "data"],
    bento_size: "2x2",
    sort_order: 20,
    customizer_schema: {
      params: [
        {
          key: "row_height",
          label: "Row Height (px)",
          type: "range_slider",
          default: 36,
          min: 28,
          max: 56,
          step: 4,
        },
        {
          key: "accent_color",
          label: "Accent Color",
          type: "color_picker",
          default: "#1D3A8A",
          palette: ["#1D3A8A", "#A31D1D", "#1D8A4A", "#8A6A1D"],
        },
        { key: "show_borders", label: "Column Borders", type: "toggle_switch", default: false },
      ],
    },
    random_data_schema: {
      columns: [
        { name: "ID", type: "string" },
        { name: "Item", type: "string" },
        { name: "Category", type: "string" },
        { name: "Value", type: "number" },
      ],
      row_count: { min: 12, max: 20 },
    },
    variants: [
      {
        language: "html",
        display_order: 1,
        code_template: `<table class="w-full border-collapse text-sm">
  <thead>
    <tr style="height: {{row_height}}px; border-bottom: 1px solid #262930;">
      <th class="text-left px-2 text-muted font-medium text-xs">ID</th>
      <th class="text-left px-2 text-muted font-medium text-xs">Item</th>
      <th class="text-left px-2 text-muted font-medium text-xs">Category</th>
      <th class="text-right px-2 text-muted font-medium text-xs">Value</th>
    </tr>
  </thead>
  <tbody>
    <tr style="height: {{row_height}}px; border-bottom: 1px solid #262930;" class="hover:bg-code">
      <td class="px-2 text-muted text-xs">#001</td>
      <td class="px-2 text-primary text-xs">Design System</td>
      <td class="px-2 text-secondary text-xs">UI</td>
      <td class="px-2 text-right text-xs" style="color: {{accent_color}};">$2,400</td>
    </tr>
    <tr style="height: {{row_height}}px; border-bottom: 1px solid #262930;" class="hover:bg-code">
      <td class="px-2 text-muted text-xs">#002</td>
      <td class="px-2 text-primary text-xs">API Gateway</td>
      <td class="px-2 text-secondary text-xs">Backend</td>
      <td class="px-2 text-right text-xs" style="color: {{accent_color}};">$4,100</td>
    </tr>
  </tbody>
</table>`,
      },
      {
        language: "react-tsx",
        display_order: 2,
        code_template: `interface CompactRow {
  id: string;
  item: string;
  category: string;
  value: number;
}

interface CompactTableProps {
  rows?: CompactRow[];
  rowHeight?: number;
  accentColor?: string;
  showBorders?: boolean;
}

export function CompactTable({
  rows = [
    { id: '#001', item: 'Design System', category: 'UI', value: 2400 },
    { id: '#002', item: 'API Gateway', category: 'Backend', value: 4100 },
  ],
  rowHeight = {{row_height}},
  accentColor = '{{accent_color}}',
}: CompactTableProps) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr style={{ height: rowHeight, borderBottom: '1px solid #262930' }}>
          <th className="text-left px-2 text-muted font-medium text-xs">ID</th>
          <th className="text-left px-2 text-muted font-medium text-xs">Item</th>
          <th className="text-left px-2 text-muted font-medium text-xs">Category</th>
          <th className="text-right px-2 text-muted font-medium text-xs">Value</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={i}
            style={{ height: rowHeight, borderBottom: '1px solid #262930' }}
            className="hover:bg-code"
          >
            <td className="px-2 text-muted text-xs">{row.id}</td>
            <td className="px-2 text-primary text-xs">{row.item}</td>
            <td className="px-2 text-secondary text-xs">{row.category}</td>
            <td className="px-2 text-right text-xs" style={{ color: accentColor }}>
              \${row.value.toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}`,
      },
    ],
  },

  // ========================
  // CHART CATEGORY
  // ========================
  {
    slug: "line-chart",
    name: "Line Chart",
    description: "Smooth line chart with gradient fill and interactive tooltips.",
    category: "chart",
    tags: ["trend", "time-series", "analytics"],
    bento_size: "2x2",
    sort_order: 30,
    customizer_schema: {
      params: [
        {
          key: "line_color",
          label: "Line Color",
          type: "color_picker",
          default: "#A31D1D",
          palette: ["#A31D1D", "#1D3A8A", "#1D8A4A", "#8A6A1D", "#6B21A8"],
        },
        {
          key: "line_width",
          label: "Line Width",
          type: "range_slider",
          default: 2,
          min: 1,
          max: 4,
          step: 1,
        },
        { key: "show_points", label: "Show Data Points", type: "toggle_switch", default: true },
        { key: "smooth_curve", label: "Smooth Curve", type: "toggle_switch", default: true },
      ],
    },
    random_data_schema: {
      data_type: "time_series",
      points: { min: 6, max: 24 },
      value_range: { min: 10, max: 100 },
      variance: 15,
    },
    variants: [
      {
        language: "html",
        display_order: 1,
        code_template: `<svg viewBox="0 0 400 200" class="w-full h-48" style="font-size: 10px;">
  <!-- Grid lines -->
  <line x1="40" y1="30" x2="380" y2="30" stroke="#262930" stroke-width="1" />
  <line x1="40" y1="70" x2="380" y2="70" stroke="#262930" stroke-width="1" />
  <line x1="40" y1="110" x2="380" y2="110" stroke="#262930" stroke-width="1" />
  <line x1="40" y1="150" x2="380" y2="150" stroke="#262930" stroke-width="1" />
  <line x1="40" y1="30" x2="40" y2="170" stroke="#262930" stroke-width="1" />
  <!-- Line -->
  <polyline fill="none" stroke="{{line_color}}" stroke-width="{{line_width}}"
    points="60,150 120,120 180,90 240,100 300,60 360,70" />
  {{#if show_points}}
  <circle cx="60" cy="150" r="3" fill="{{line_color}}" />
  <circle cx="120" cy="120" r="3" fill="{{line_color}}" />
  <circle cx="180" cy="90" r="3" fill="{{line_color}}" />
  <circle cx="240" cy="100" r="3" fill="{{line_color}}" />
  <circle cx="300" cy="60" r="3" fill="{{line_color}}" />
  <circle cx="360" cy="70" r="3" fill="{{line_color}}" />
  {{/if}}
</svg>`,
      },
      {
        language: "react-tsx",
        display_order: 2,
        code_template: `interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data?: DataPoint[];
  lineColor?: string;
  lineWidth?: number;
  showPoints?: boolean;
  smoothCurve?: boolean;
}

export function LineChart({
  data = [
    { label: 'Mon', value: 30 },
    { label: 'Tue', value: 50 },
    { label: 'Wed', value: 80 },
    { label: 'Thu', value: 65 },
    { label: 'Fri', value: 95 },
    { label: 'Sat', value: 70 },
  ],
  lineColor = '{{line_color}}',
  lineWidth = {{line_width}},
  showPoints = {{show_points}},
}: LineChartProps) {
  const maxVal = Math.max(...data.map((d) => d.value));
  const w = 400, h = 200, pad = { top: 20, bottom: 30, left: 40, right: 20 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  const xScale = (i: number) => pad.left + (i / (data.length - 1)) * plotW;
  const yScale = (v: number) => pad.top + plotH - (v / maxVal) * plotH;

  const points = data.map((d, i) => \`\${xScale(i)},\${yScale(d.value)}\`).join(' ');

  return (
    <svg viewBox={\`0 0 \${w} \${h}\`} className="w-full h-48">
      {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
        <line
          key={frac}
          x1={pad.left} y1={pad.top + plotH * (1 - frac)}
          x2={pad.left + plotW} y2={pad.top + plotH * (1 - frac)}
          stroke="#262930" strokeWidth={1}
        />
      ))}
      <polyline
        fill="none"
        stroke={lineColor}
        strokeWidth={lineWidth}
        points={points}
      />
      {showPoints && data.map((d, i) => (
        <circle
          key={i}
          cx={xScale(i)}
          cy={yScale(d.value)}
          r={3}
          fill={lineColor}
        />
      ))}
    </svg>
  );
}`,
      },
    ],
  },

  {
    slug: "bar-chart",
    name: "Bar Chart",
    description: "Horizontal bar chart for comparing values across categories.",
    category: "chart",
    tags: ["comparison", "distribution", "stats"],
    bento_size: "2x2",
    sort_order: 40,
    customizer_schema: {
      params: [
        {
          key: "bar_color",
          label: "Bar Color",
          type: "color_picker",
          default: "#1D8A4A",
          palette: ["#1D8A4A", "#A31D1D", "#1D3A8A", "#8A6A1D"],
        },
        {
          key: "bar_gap",
          label: "Bar Gap (px)",
          type: "range_slider",
          default: 8,
          min: 2,
          max: 20,
          step: 2,
        },
        { key: "show_labels", label: "Show Values", type: "toggle_switch", default: true },
      ],
    },
    random_data_schema: {
      data_type: "categorical",
      categories: { min: 4, max: 8 },
      value_range: { min: 5, max: 100 },
    },
    variants: [
      {
        language: "html",
        display_order: 1,
        code_template: `<div class="flex flex-col gap-{{bar_gap}} px-4 py-4">
  <div class="flex items-center gap-3">
    <span class="w-20 text-xs text-secondary text-right">Design</span>
    <div class="flex-1 h-5" style="background: #262930;">
      <div class="h-full" style="width: 75%; background: {{bar_color}};"></div>
    </div>
    {{#if show_labels}}
    <span class="text-xs text-primary w-8">75</span>
    {{/if}}
  </div>
  <div class="flex items-center gap-3">
    <span class="w-20 text-xs text-secondary text-right">Dev</span>
    <div class="flex-1 h-5" style="background: #262930;">
      <div class="h-full" style="width: 60%; background: {{bar_color}};"></div>
    </div>
    {{#if show_labels}}
    <span class="text-xs text-primary w-8">60</span>
    {{/if}}
  </div>
  <div class="flex items-center gap-3">
    <span class="w-20 text-xs text-secondary text-right">Marketing</span>
    <div class="flex-1 h-5" style="background: #262930;">
      <div class="h-full" style="width: 40%; background: {{bar_color}};"></div>
    </div>
    {{#if show_labels}}
    <span class="text-xs text-primary w-8">40</span>
    {{/if}}
  </div>
</div>`,
      },
      {
        language: "react-tsx",
        display_order: 2,
        code_template: `interface BarItem {
  label: string;
  value: number;
}

interface BarChartProps {
  data?: BarItem[];
  barColor?: string;
  barGap?: number;
  showLabels?: boolean;
}

export function BarChart({
  data = [
    { label: 'Design', value: 75 },
    { label: 'Dev', value: 60 },
    { label: 'Marketing', value: 40 },
    { label: 'Sales', value: 90 },
  ],
  barColor = '{{bar_color}}',
  barGap = {{bar_gap}},
  showLabels = {{show_labels}},
}: BarChartProps) {
  const maxVal = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex flex-col gap-3 px-4 py-4">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-20 text-xs text-secondary text-right truncate">
            {item.label}
          </span>
          <div className="flex-1 h-5" style={{ background: '#262930' }}>
            <div
              className="h-full transition-all duration-300"
              style={{ width: \`\${(item.value / maxVal) * 100}%\`, background: barColor }}
            />
          </div>
          {showLabels && (
            <span className="text-xs text-primary w-8">{item.value}</span>
          )}
        </div>
      ))}
    </div>
  );
}`,
      },
    ],
  },

  {
    slug: "donut-chart",
    name: "Donut Chart",
    description: "Circular donut chart for showing proportional category distribution.",
    category: "chart",
    tags: ["proportion", "distribution", "pie"],
    bento_size: "2x1",
    sort_order: 50,
    customizer_schema: {
      params: [
        {
          key: "segment_1",
          label: "Segment 1 Color",
          type: "color_picker",
          default: "#A31D1D",
          palette: ["#A31D1D", "#1D3A8A", "#1D8A4A", "#8A6A1D", "#6B21A8", "#0D9488"],
        },
        {
          key: "segment_2",
          label: "Segment 2 Color",
          type: "color_picker",
          default: "#1D3A8A",
          palette: ["#1D3A8A", "#A31D1D", "#1D8A4A", "#8A6A1D", "#6B21A8", "#0D9488"],
        },
        {
          key: "inner_radius",
          label: "Inner Radius",
          type: "range_slider",
          default: 60,
          min: 30,
          max: 80,
          step: 5,
        },
        { key: "show_legend", label: "Show Legend", type: "toggle_switch", default: true },
      ],
    },
    random_data_schema: {
      data_type: "proportional",
      segments: { min: 3, max: 6 },
    },
    variants: [
      {
        language: "html",
        display_order: 1,
        code_template: `<div class="flex items-center justify-center gap-6 p-4">
  <svg width="120" height="120" viewBox="0 0 120 120">
    <circle cx="60" cy="60" r="50" fill="none" stroke="#262930" stroke-width="20" />
    <circle cx="60" cy="60" r="50" fill="none" stroke="{{segment_1}}" stroke-width="20"
      stroke-dasharray="157 314" stroke-dashoffset="0" transform="rotate(-90 60 60)" />
    <circle cx="60" cy="60" r="50" fill="none" stroke="{{segment_2}}" stroke-width="20"
      stroke-dasharray="94 314" stroke-dashoffset="-157" transform="rotate(-90 60 60)" />
  </svg>
  {{#if show_legend}}
  <div class="flex flex-col gap-2 text-xs">
    <div class="flex items-center gap-2"><span class="w-3 h-3" style="background: {{segment_1}};"></span> Design (50%)</div>
    <div class="flex items-center gap-2"><span class="w-3 h-3" style="background: {{segment_2}};"></span> Dev (30%)</div>
    <div class="flex items-center gap-2"><span class="w-3 h-3" style="background: #262930;"></span> Other (20%)</div>
  </div>
  {{/if}}
</div>`,
      },
      {
        language: "react-tsx",
        display_order: 2,
        code_template: `interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments?: DonutSegment[];
  innerRadius?: number;
  showLegend?: boolean;
}

export function DonutChart({
  segments = [
    { label: 'Design', value: 50, color: '{{segment_1}}' },
    { label: 'Dev', value: 30, color: '{{segment_2}}' },
    { label: 'Other', value: 20, color: '#262930' },
  ],
  innerRadius = {{inner_radius}},
  showLegend = {{show_legend}},
}: DonutChartProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const cx = 60, cy = 60, r = 50;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex items-center justify-center gap-6 p-4">
      <svg width={120} height={120} viewBox="0 0 120 120">
        {segments.map((seg, i) => {
          const dashLen = (seg.value / total) * circumference;
          const dash = \`\${dashLen} \${circumference}\`;
          const el = (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={2 * (r - innerRadius / 2)}
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              transform="rotate(-90 60 60)"
            />
          );
          offset += dashLen;
          return el;
        })}
      </svg>
      {showLegend && (
        <div className="flex flex-col gap-2 text-xs">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-3 h-3" style={{ background: seg.color }} />
              {seg.label} ({Math.round((seg.value / total) * 100)}%)
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`,
      },
    ],
  },

  // ========================
  // NAVIGATION CATEGORY
  // ========================
  {
    slug: "sidebar-navigation",
    name: "Sidebar Navigation",
    description: "Vertical sidebar with grouped navigation links and active state highlighting.",
    category: "navigation",
    tags: ["sidebar", "menu", "vertical"],
    bento_size: "2x1",
    sort_order: 60,
    customizer_schema: {
      params: [
        {
          key: "accent_color",
          label: "Accent Color",
          type: "color_picker",
          default: "#A31D1D",
          palette: ["#A31D1D", "#1D3A8A", "#1D8A4A", "#8A6A1D"],
        },
        {
          key: "item_height",
          label: "Item Height (px)",
          type: "range_slider",
          default: 40,
          min: 32,
          max: 56,
          step: 4,
        },
        { key: "show_icons", label: "Show Icons", type: "toggle_switch", default: true },
        { key: "collapsible", label: "Collapsible Groups", type: "toggle_switch", default: false },
      ],
    },
    variants: [
      {
        language: "html",
        display_order: 1,
        code_template: `<nav class="w-56 bg-card border-r border-default h-full">
  <div class="p-4 border-b border-default">
    <h3 class="text-sm font-semibold text-primary">Project</h3>
  </div>
  <div class="py-2">
    <div class="px-4 py-1 text-xs text-muted uppercase tracking-wide">Main</div>
    <a href="#" style="height: {{item_height}}px;"
       class="flex items-center gap-3 px-4 text-sm text-primary bg-code border-l-2 border-{{accent_color}}">
      {{#if show_icons}}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>{{/if}}
      Dashboard
    </a>
    <a href="#" style="height: {{item_height}}px;"
       class="flex items-center gap-3 px-4 text-sm text-secondary hover:bg-code hover:text-primary">
      {{#if show_icons}}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 4-6"/></svg>{{/if}}
      Analytics
    </a>
  </div>
</nav>`,
      },
      {
        language: "react-tsx",
        display_order: 2,
        code_template: `interface NavItem {
  label: string;
  icon?: string;
  href: string;
  active?: boolean;
}

interface SidebarNavProps {
  items?: NavItem[];
  accentColor?: string;
  itemHeight?: number;
  showIcons?: boolean;
  collapsible?: boolean;
}

const defaultItems: NavItem[] = [
  { label: 'Dashboard', icon: 'grid', href: '/dashboard', active: true },
  { label: 'Analytics', icon: 'chart', href: '/analytics' },
  { label: 'Settings', icon: 'settings', href: '/settings' },
];

export function SidebarNavigation({
  items = defaultItems,
  accentColor = '{{accent_color}}',
  itemHeight = {{item_height}},
  showIcons = {{show_icons}},
}: SidebarNavProps) {
  return (
    <nav className="w-56 bg-card border-r border-default h-full">
      <div className="p-4 border-b border-default">
        <h3 className="text-sm font-semibold text-primary">Project</h3>
      </div>
      <div className="py-2">
        <div className="px-4 py-1 text-xs text-muted uppercase tracking-wide">Main</div>
        {items.map((item, i) => (
          <a
            key={i}
            href={item.href}
            style={{ height: itemHeight }}
            className={\`flex items-center gap-3 px-4 text-sm \${
              item.active
                ? 'text-primary bg-code border-l-2'
                : 'text-secondary hover:bg-code hover:text-primary'
            }\`}
            style={{
              ...(item.active ? { borderLeftColor: accentColor } : {}),
              height: itemHeight,
            }}
          >
            {showIcons && <Icon name={item.icon} size={16} />}
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

function Icon({ name, size }: { name: string; size: number }) {
  // Replace with your icon component
  return <span style={{ width: size, height: size }} />;
}`,
      },
    ],
  },

  {
    slug: "top-navigation",
    name: "Top Navigation Bar",
    description: "Horizontal top navigation bar with dropdown menus and search.",
    category: "navigation",
    tags: ["navbar", "horizontal", "top-bar"],
    bento_size: "2x1",
    sort_order: 70,
    customizer_schema: {
      params: [
        {
          key: "accent_color",
          label: "Accent Color",
          type: "color_picker",
          default: "#A31D1D",
          palette: ["#A31D1D", "#1D3A8A", "#1D8A4A", "#8A6A1D"],
        },
        {
          key: "nav_height",
          label: "Nav Height (px)",
          type: "range_slider",
          default: 56,
          min: 44,
          max: 72,
          step: 4,
        },
        { key: "sticky", label: "Sticky on Scroll", type: "toggle_switch", default: true },
      ],
    },
    variants: [
      {
        language: "html",
        display_order: 1,
        code_template: `<header style="height: {{nav_height}}px; {{#if sticky}}position: sticky; top: 0;{{/if}}"
        class="flex items-center justify-between px-6 bg-card border-b border-default">
  <div class="flex items-center gap-8">
    <span class="text-sm font-bold text-primary">ApexUI</span>
    <nav class="flex items-center gap-1">
      <a href="#" class="px-3 py-1 text-sm text-primary border-b-2" style="border-color: {{accent_color}};">Overview</a>
      <a href="#" class="px-3 py-1 text-sm text-secondary hover:text-primary">Components</a>
      <a href="#" class="px-3 py-1 text-sm text-secondary hover:text-primary">Docs</a>
    </nav>
  </div>
  <div class="flex items-center gap-3">
    <input type="search" placeholder="Search..." class="bg-code border border-default px-3 py-1.5 text-sm text-primary placeholder:text-muted w-48" />
  </div>
</header>`,
      },
      {
        language: "react-tsx",
        display_order: 2,
        code_template: `interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

interface TopNavProps {
  links?: NavLink[];
  accentColor?: string;
  navHeight?: number;
  sticky?: boolean;
}

export function TopNavigation({
  links = [
    { label: 'Overview', href: '/', active: true },
    { label: 'Components', href: '/components' },
    { label: 'Docs', href: '/docs' },
  ],
  accentColor = '{{accent_color}}',
  navHeight = {{nav_height}},
  sticky = {{sticky}},
}: TopNavProps) {
  return (
    <header
      style={{
        height: navHeight,
        position: sticky ? 'sticky' : undefined,
        top: sticky ? 0 : undefined,
      }}
      className="flex items-center justify-between px-6 bg-card border-b border-default"
    >
      <div className="flex items-center gap-8">
        <span className="text-sm font-bold text-primary">ApexUI</span>
        <nav className="flex items-center gap-1">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className={\`px-3 py-1 text-sm \${
                link.active ? 'text-primary border-b-2' : 'text-secondary hover:text-primary'
              }\`}
              style={link.active ? { borderBottomColor: accentColor } : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="search"
          placeholder="Search..."
          className="bg-code border border-default px-3 py-1.5 text-sm text-primary placeholder:text-muted w-48"
        />
      </div>
    </header>
  );
}`,
      },
    ],
  },

  {
    slug: "breadcrumb-nav",
    name: "Breadcrumb Navigation",
    description: "Simple breadcrumb trail for page hierarchy context.",
    category: "navigation",
    tags: ["breadcrumb", "hierarchy", "trail"],
    bento_size: "1x1",
    sort_order: 80,
    customizer_schema: {
      params: [
        {
          key: "accent_color",
          label: "Accent Color",
          type: "color_picker",
          default: "#A31D1D",
          palette: ["#A31D1D", "#1D3A8A", "#1D8A4A", "#8A6A1D"],
        },
        {
          key: "separator_size",
          label: "Separator Size",
          type: "range_slider",
          default: 14,
          min: 10,
          max: 20,
          step: 2,
        },
        { key: "show_home", label: "Show Home Icon", type: "toggle_switch", default: true },
      ],
    },
    variants: [
      {
        language: "html",
        display_order: 1,
        code_template: `<nav class="flex items-center gap-2 px-4 py-3 text-sm">
  {{#if show_home}}
  <a href="#" class="text-secondary hover:text-primary">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
    </svg>
  </a>
  <span class="text-muted" style="font-size: {{separator_size}}px;">/</span>
  {{/if}}
  <a href="#" class="text-secondary hover:text-primary">Components</a>
  <span class="text-muted" style="font-size: {{separator_size}}px;">/</span>
  <span class="text-primary" style="color: {{accent_color}};">Data Table</span>
</nav>`,
      },
      {
        language: "react-tsx",
        display_order: 2,
        code_template: `interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  crumbs?: Crumb[];
  accentColor?: string;
  separatorSize?: number;
  showHome?: boolean;
}

export function Breadcrumb({
  crumbs = [
    { label: 'Components', href: '/components' },
    { label: 'Data Table' },
  ],
  accentColor = '{{accent_color}}',
  separatorSize = {{separator_size}},
  showHome = {{show_home}},
}: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 px-4 py-3 text-sm">
      {showHome && (
        <>
          <a href="/" className="text-secondary hover:text-primary">
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </a>
          <span className="text-muted" style={{ fontSize: separatorSize }}>/</span>
        </>
      )}
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-muted" style={{ fontSize: separatorSize }}>/</span>}
          {crumb.href ? (
            <a href={crumb.href} className="text-secondary hover:text-primary">
              {crumb.label}
            </a>
          ) : (
            <span style={{ color: accentColor }}>{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}`,
      },
    ],
  },

  // ========================
  // BENTO CATEGORY
  // ========================
  {
    slug: "bento-stats-grid",
    name: "Bento Stats Grid",
    description: "Bento-style stats dashboard with KPI cards in varied sizes.",
    category: "bento",
    tags: ["stats", "kpi", "dashboard", "grid"],
    bento_size: "2x2",
    sort_order: 90,
    customizer_schema: {
      params: [
        {
          key: "accent_color",
          label: "Accent Color",
          type: "color_picker",
          default: "#A31D1D",
          palette: ["#A31D1D", "#1D3A8A", "#1D8A4A", "#8A6A1D"],
        },
        {
          key: "card_gap",
          label: "Card Gap (px)",
          type: "range_slider",
          default: 4,
          min: 1,
          max: 12,
          step: 1,
        },
        { key: "show_trend", label: "Show Trend Arrows", type: "toggle_switch", default: true },
      ],
    },
    variants: [
      {
        language: "html",
        display_order: 1,
        code_template: `<div class="grid grid-cols-4 gap-{{card_gap}} p-2" style="gap: {{card_gap}}px;">
  <div class="col-span-2 row-span-1 bg-card border border-default p-4">
    <p class="text-xs text-muted">Total Revenue</p>
    <p class="text-2xl font-bold text-primary mt-1">$45,230</p>
    {{#if show_trend}}<p class="text-xs mt-1" style="color: {{accent_color}};">↑ 12.5%</p>{{/if}}
  </div>
  <div class="col-span-1 row-span-1 bg-card border border-default p-4">
    <p class="text-xs text-muted">Users</p>
    <p class="text-2xl font-bold text-primary mt-1">1,482</p>
    {{#if show_trend}}<p class="text-xs mt-1" style="color: {{accent_color}};">↑ 8.3%</p>{{/if}}
  </div>
  <div class="col-span-1 row-span-1 bg-card border border-default p-4">
    <p class="text-xs text-muted">Orders</p>
    <p class="text-2xl font-bold text-primary mt-1">342</p>
    {{#if show_trend}}<p class="text-xs mt-1 text-secondary">→ 0%</p>{{/if}}
  </div>
  <div class="col-span-4 row-span-1 bg-card border border-default p-4">
    <p class="text-xs text-muted">Activity</p>
    <div class="flex gap-1 mt-2 h-8 items-end">
      <div class="flex-1" style="height: 60%; background: {{accent_color}};"></div>
      <div class="flex-1" style="height: 80%; background: {{accent_color}};"></div>
      <div class="flex-1" style="height: 45%; background: {{accent_color}};"></div>
      <div class="flex-1" style="height: 90%; background: {{accent_color}};"></div>
      <div class="flex-1" style="height: 70%; background: {{accent_color}};"></div>
    </div>
  </div>
</div>`,
      },
      {
        language: "react-tsx",
        display_order: 2,
        code_template: `interface StatCard {
  title: string;
  value: string;
  trend?: string;
  trendDir?: 'up' | 'down' | 'flat';
}

interface StatsGridProps {
  stats?: StatCard[];
  accentColor?: string;
  cardGap?: number;
  showTrend?: boolean;
}

export function BentoStatsGrid({
  stats = [
    { title: 'Total Revenue', value: '$45,230', trend: '12.5%', trendDir: 'up' },
    { title: 'Users', value: '1,482', trend: '8.3%', trendDir: 'up' },
    { title: 'Orders', value: '342', trend: '0%', trendDir: 'flat' },
  ],
  accentColor = '{{accent_color}}',
  cardGap = {{card_gap}},
  showTrend = {{show_trend}},
}: StatsGridProps) {
  const trendColor = (dir?: string) =>
    dir === 'up' ? accentColor : dir === 'down' ? '#A31D1D' : '#9A9BA0';
  const trendArrow = (dir?: string) =>
    dir === 'up' ? '↑' : dir === 'down' ? '↓' : '→';

  return (
    <div className="grid grid-cols-4 gap-2 p-2" style={{ gap: cardGap }}>
      {stats.slice(0, 1).map((stat, i) => (
        <div key={i} className="col-span-2 row-span-1 bg-card border border-default p-4">
          <p className="text-xs text-muted">{stat.title}</p>
          <p className="text-2xl font-bold text-primary mt-1">{stat.value}</p>
          {showTrend && stat.trend && (
            <p className="text-xs mt-1" style={{ color: trendColor(stat.trendDir) }}>
              {trendArrow(stat.trendDir)} {stat.trend}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}`,
      },
    ],
  },

  {
    slug: "bento-feature-grid",
    name: "Bento Feature Grid",
    description: "Bento layout showcasing product features with icons and descriptions.",
    category: "bento",
    tags: ["features", "showcase", "grid"],
    bento_size: "2x2",
    sort_order: 100,
    customizer_schema: {
      params: [
        {
          key: "accent_color",
          label: "Accent Color",
          type: "color_picker",
          default: "#0D9488",
          palette: ["#0D9488", "#A31D1D", "#1D3A8A", "#8A6A1D"],
        },
        {
          key: "border_radius",
          label: "Border Radius",
          type: "range_slider",
          default: 4,
          min: 0,
          max: 4,
          step: 2,
        },
        { key: "show_icons", label: "Show Icons", type: "toggle_switch", default: true },
      ],
    },
    variants: [
      {
        language: "html",
        display_order: 1,
        code_template: `<div class="grid grid-cols-3 gap-1 p-2">
  <div class="col-span-2 row-span-1 bg-card border border-default p-4" style="border-radius: {{border_radius}}px;">
    {{#if show_icons}}<div class="w-8 h-8 border border-default flex items-center justify-center text-sm mb-3" style="color: {{accent_color}};">⚡</div>{{/if}}
    <h3 class="text-sm font-semibold text-primary">Lightning Fast</h3>
    <p class="text-xs text-secondary mt-1">Optimized for performance with zero runtime overhead.</p>
  </div>
  <div class="col-span-1 row-span-2 bg-card border border-default p-4" style="border-radius: {{border_radius}}px;">
    {{#if show_icons}}<div class="w-8 h-8 border border-default flex items-center justify-center text-sm mb-3" style="color: {{accent_color}};">🔒</div>{{/if}}
    <h3 class="text-sm font-semibold text-primary">Secure</h3>
    <p class="text-xs text-secondary mt-1">Enterprise-grade security built in.</p>
  </div>
  <div class="col-span-1 row-span-1 bg-card border border-default p-4" style="border-radius: {{border_radius}}px;">
    {{#if show_icons}}<div class="w-8 h-8 border border-default flex items-center justify-center text-sm mb-3" style="color: {{accent_color}};">🎨</div>{{/if}}
    <h3 class="text-sm font-semibold text-primary">Customizable</h3>
    <p class="text-xs text-secondary mt-1">Fully themeable design system.</p>
  </div>
  <div class="col-span-1 row-span-1 bg-card border border-default p-4" style="border-radius: {{border_radius}}px;">
    {{#if show_icons}}<div class="w-8 h-8 border border-default flex items-center justify-center text-sm mb-3" style="color: {{accent_color}};">📦</div>{{/if}}
    <h3 class="text-sm font-semibold text-primary">Modular</h3>
    <p class="text-xs text-secondary mt-1">Use only what you need.</p>
  </div>
</div>`,
      },
      {
        language: "react-tsx",
        display_order: 2,
        code_template: `interface Feature {
  icon: string;
  title: string;
  description: string;
  size?: '1x1' | '2x1' | '1x2' | '2x2';
}

interface FeatureGridProps {
  features?: Feature[];
  accentColor?: string;
  borderRadius?: number;
  showIcons?: boolean;
}

const defaultFeatures: Feature[] = [
  { icon: '⚡', title: 'Lightning Fast', description: 'Optimized for performance.', size: '2x1' },
  { icon: '🔒', title: 'Secure', description: 'Enterprise-grade security.', size: '1x2' },
  { icon: '🎨', title: 'Customizable', description: 'Fully themeable design.', size: '1x1' },
  { icon: '📦', title: 'Modular', description: 'Use only what you need.', size: '1x1' },
];

export function BentoFeatureGrid({
  features = defaultFeatures,
  accentColor = '{{accent_color}}',
  borderRadius = {{border_radius}},
  showIcons = {{show_icons}},
}: FeatureGridProps) {
  const sizeClass = (size?: string) => {
    switch (size) {
      case '2x1': return 'col-span-2 row-span-1';
      case '1x2': return 'col-span-1 row-span-2';
      default: return 'col-span-1 row-span-1';
    }
  };

  return (
    <div className="grid grid-cols-3 gap-1 p-2">
      {features.map((f, i) => (
        <div
          key={i}
          className={\`\${sizeClass(f.size)} bg-card border border-default p-4\`}
          style={{ borderRadius }}
        >
          {showIcons && (
            <div
              className="w-8 h-8 border border-default flex items-center justify-center text-sm mb-3"
              style={{ color: accentColor }}
            >
              {f.icon}
            </div>
          )}
          <h3 className="text-sm font-semibold text-primary">{f.title}</h3>
          <p className="text-xs text-secondary mt-1">{f.description}</p>
        </div>
      ))}
    </div>
  );
}`,
      },
    ],
  },

  {
    slug: "bento-profile-card",
    name: "Bento Profile Card",
    description: "Compact profile card with avatar, stats, and action buttons.",
    category: "bento",
    tags: ["profile", "card", "user"],
    bento_size: "1x1",
    sort_order: 110,
    customizer_schema: {
      params: [
        {
          key: "accent_color",
          label: "Accent Color",
          type: "color_picker",
          default: "#8A6A1D",
          palette: ["#8A6A1D", "#A31D1D", "#1D3A8A", "#0D9488"],
        },
        {
          key: "avatar_size",
          label: "Avatar Size (px)",
          type: "range_slider",
          default: 48,
          min: 32,
          max: 80,
          step: 8,
        },
        { key: "show_bio", label: "Show Bio", type: "toggle_switch", default: true },
      ],
    },
    variants: [
      {
        language: "html",
        display_order: 1,
        code_template: `<div class="bg-card border border-default p-4 flex flex-col items-center text-center">
  <div style="width: {{avatar_size}}px; height: {{avatar_size}}px;"
       class="rounded-none border border-default flex items-center justify-center text-lg font-bold"
       style="color: {{accent_color}}; background: #1E222B;">
    JD
  </div>
  <h3 class="text-sm font-semibold text-primary mt-3">Jane Doe</h3>
  <p class="text-xs text-secondary">Senior Developer</p>
  {{#if show_bio}}
  <p class="text-xs text-muted mt-2">Building beautiful interfaces with ApexUI.</p>
  {{/if}}
  <div class="flex gap-2 mt-4 w-full">
    <button class="flex-1 py-1.5 text-xs border border-default text-secondary hover:text-primary hover:border-accent transition-colors duration-75">Follow</button>
    <button class="flex-1 py-1.5 text-xs border border-default text-secondary hover:text-primary hover:border-accent transition-colors duration-75">Message</button>
  </div>
</div>`,
      },
      {
        language: "react-tsx",
        display_order: 2,
        code_template: `interface ProfileCardProps {
  name?: string;
  role?: string;
  bio?: string;
  initials?: string;
  accentColor?: string;
  avatarSize?: number;
  showBio?: boolean;
}

export function BentoProfileCard({
  name = 'Jane Doe',
  role = 'Senior Developer',
  bio = 'Building beautiful interfaces with ApexUI.',
  initials = 'JD',
  accentColor = '{{accent_color}}',
  avatarSize = {{avatar_size}},
  showBio = {{show_bio}},
}: ProfileCardProps) {
  return (
    <div className="bg-card border border-default p-4 flex flex-col items-center text-center">
      <div
        style={{
          width: avatarSize,
          height: avatarSize,
          color: accentColor,
          background: '#1E222B',
        }}
        className="border border-default flex items-center justify-center text-lg font-bold"
      >
        {initials}
      </div>
      <h3 className="text-sm font-semibold text-primary mt-3">{name}</h3>
      <p className="text-xs text-secondary">{role}</p>
      {showBio && (
        <p className="text-xs text-muted mt-2">{bio}</p>
      )}
      <div className="flex gap-2 mt-4 w-full">
        <button className="flex-1 py-1.5 text-xs border border-default text-secondary hover:text-primary hover:border-accent transition-colors duration-75">
          Follow
        </button>
        <button className="flex-1 py-1.5 text-xs border border-default text-secondary hover:text-primary hover:border-accent transition-colors duration-75">
          Message
        </button>
      </div>
    </div>
  );
}`,
      },
    ],
  },
];

async function seed() {
  console.log("Seeding ApexUI database...\n");

  // Clean existing data
  await supabase.from("code_variants").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("components").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  for (const comp of components) {
    const { data: component, error: err } = await supabase
      .from("components")
      .insert({
        slug: comp.slug,
        name: comp.name,
        description: comp.description,
        category: comp.category,
        tags: comp.tags,
        bento_size: comp.bento_size,
        sort_order: comp.sort_order,
        is_published: true,
        customizer_schema: comp.customizer_schema,
        random_data_schema: comp.random_data_schema ?? null,
      })
      .select("id")
      .single();

    if (err) {
      console.error(`✗ ${comp.slug}: ${err.message}`);
      continue;
    }

    // Insert code variants
    for (const variant of comp.variants) {
      const { error: vErr } = await supabase.from("code_variants").insert({
        component_id: component.id,
        language: variant.language,
        code_template: variant.code_template,
        display_order: variant.display_order,
      });

      if (vErr) {
        console.error(`  ✗ variant ${variant.language}: ${vErr.message}`);
      }
    }

    console.log(`✓ ${comp.name} (${comp.category}) — ${comp.variants.length} variants`);
  }

  console.log("\nSeed complete!");
}

seed().catch(console.error);
