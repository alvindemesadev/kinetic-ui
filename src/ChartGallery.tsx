"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const activityData = [
  { month: "Feb", current: 38, previous: 22 },
  { month: "Mar", current: 47, previous: 31 },
  { month: "Apr", current: 43, previous: 36 },
  { month: "May", current: 62, previous: 42 },
  { month: "Jun", current: 56, previous: 48 },
  { month: "Jul", current: 78, previous: 54 },
  { month: "Aug", current: 88, previous: 61 },
];

const categoryData = [
  { name: "UI", value: 82 },
  { name: "Core", value: 66 },
  { name: "Files", value: 91 },
  { name: "Tools", value: 54 },
  { name: "Media", value: 73 },
];

const distributionData = [
  { name: "Desktop", value: 48, color: "#ff6a2a" },
  { name: "Tablet", value: 27, color: "#559bff" },
  { name: "Mobile", value: 17, color: "#45b87f" },
  { name: "Other", value: 8, color: "#e8a33d" },
];

const radarData = [
  { subject: "Speed", current: 92, previous: 64 },
  { subject: "Clarity", current: 84, previous: 72 },
  { subject: "Depth", current: 96, previous: 58 },
  { subject: "Access", current: 78, previous: 68 },
  { subject: "Motion", current: 71, previous: 61 },
  { subject: "Scale", current: 88, previous: 75 },
];

const radialData = [
  { name: "Tokens", value: 96, fill: "#ff6a2a" },
  { name: "Controls", value: 84, fill: "#559bff" },
  { name: "Patterns", value: 72, fill: "#45b87f" },
];

type TipPayload = { name?: string; value?: number | string; color?: string; fill?: string };

function ChartTip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TipPayload[];
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      {label !== undefined && <strong>{label}</strong>}
      {payload.map((item, index) => (
        <span key={`${item.name}-${index}`}>
          <i style={{ background: item.color ?? item.fill ?? "var(--accent)" }} />
          <small>{item.name}</small>
          <b>{item.value}</b>
        </span>
      ))}
    </div>
  );
}

function ChartCard({
  title,
  eyebrow,
  summary,
  children,
  className = "",
}: {
  title: string;
  eyebrow: string;
  summary: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article className={`panel chart-panel ${className}`}>
      <header>
        <div>
          <span>{eyebrow}</span>
          <h3>{title}</h3>
        </div>
        <small>{summary}</small>
      </header>
      <div className="chart-stage">{children}</div>
    </article>
  );
}

const axis = { fontSize: 11, fill: "var(--text-muted)" };
const tooltipMotion = {
  isAnimationActive: false as const,
  animationDuration: 0,
  wrapperStyle: { transition: "none" },
};

export default function ChartGallery() {
  return (
    <div className="chart-grid" aria-label="Chart component examples">
      <ChartCard title="Area chart" eyebrow="Engagement" summary="+18.4%">
        <ResponsiveContainer initialDimension={{ width: 400, height: 252 }} width="100%" height="100%">
          <AreaChart data={activityData} margin={{ top: 12, right: 8, left: -20, bottom: 2 }}>
            <defs>
              <linearGradient id="areaSignal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff6a2a" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#ff6a2a" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="3 5" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={axis} />
            <YAxis axisLine={false} tickLine={false} tick={axis} />
            <Tooltip
              {...tooltipMotion}
              content={<ChartTip />}
              cursor={{ stroke: "var(--border)", strokeDasharray: "3 3" }}
            />
            <Area
              type="monotone"
              dataKey="current"
              name="Sessions"
              stroke="#ff6a2a"
              strokeWidth={2.4}
              fill="url(#areaSignal)"
              activeDot={{ r: 5, fill: "#ff6a2a", stroke: "var(--surface-top)", strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Bar chart" eyebrow="Module health" summary="73 avg">
        <ResponsiveContainer initialDimension={{ width: 400, height: 252 }} width="100%" height="100%">
          <BarChart data={categoryData} margin={{ top: 10, right: 8, left: -20, bottom: 2 }}>
            <CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="3 5" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={axis} />
            <YAxis axisLine={false} tickLine={false} tick={axis} />
            <Tooltip {...tooltipMotion} content={<ChartTip />} cursor={{ fill: "var(--chart-hover)" }} />
            <Bar dataKey="value" name="Score" fill="#ff6a2a" radius={[5, 5, 2, 2]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Line chart" eyebrow="Performance" summary="2 series">
        <ResponsiveContainer initialDimension={{ width: 400, height: 252 }} width="100%" height="100%">
          <LineChart data={activityData} margin={{ top: 12, right: 10, left: -20, bottom: 2 }}>
            <CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="3 5" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={axis} />
            <YAxis axisLine={false} tickLine={false} tick={axis} />
            <Tooltip {...tooltipMotion} content={<ChartTip />} cursor={{ stroke: "var(--border)" }} />
            <Line
              type="monotone"
              dataKey="current"
              name="Current"
              stroke="#ff6a2a"
              strokeWidth={2.4}
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="previous"
              name="Previous"
              stroke="#559bff"
              strokeWidth={1.8}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Pie chart" eyebrow="Device share" summary="4 segments">
        <div className="pie-layout">
          <ResponsiveContainer initialDimension={{ width: 400, height: 252 }} width="62%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="78%"
                stroke="var(--surface-top)"
                strokeWidth={3}
              >
                {distributionData.map((item) => (
                  <Cell fill={item.color} key={item.name} />
                ))}
              </Pie>
              <Tooltip {...tooltipMotion} content={<ChartTip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            {distributionData.map((item) => (
              <span key={item.name}>
                <i style={{ background: item.color }} />
                <small>{item.name}</small>
                <b>{item.value}%</b>
              </span>
            ))}
          </div>
        </div>
      </ChartCard>

      <ChartCard title="Radar chart" eyebrow="Quality profile" summary="6 axes">
        <ResponsiveContainer initialDimension={{ width: 400, height: 252 }} width="100%" height="100%">
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="72%">
            <PolarGrid stroke="var(--chart-grid)" />
            <PolarAngleAxis dataKey="subject" tick={axis} />
            <Tooltip {...tooltipMotion} content={<ChartTip />} />
            <Radar
              name="Current"
              dataKey="current"
              stroke="#ff6a2a"
              strokeWidth={2}
              fill="#ff6a2a"
              fillOpacity={0.25}
            />
            <Radar
              name="Previous"
              dataKey="previous"
              stroke="#559bff"
              strokeWidth={1.5}
              fill="#559bff"
              fillOpacity={0.08}
            />
          </RadarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Radial chart" eyebrow="System coverage" summary="84% avg">
        <div className="radial-wrap">
          <ResponsiveContainer initialDimension={{ width: 400, height: 252 }} width="100%" height="100%">
            <RadialBarChart
              innerRadius="28%"
              outerRadius="95%"
              data={radialData}
              startAngle={90}
              endAngle={-270}
              barSize={12}
            >
              <RadialBar dataKey="value" background={{ fill: "var(--chart-track)" }} cornerRadius={8} />
              <Tooltip {...tooltipMotion} content={<ChartTip />} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="radial-center">
            <strong>84%</strong>
            <span>Complete</span>
          </div>
        </div>
      </ChartCard>

      <ChartCard title="Donut chart" eyebrow="Storage use" summary="68% used">
        <div className="donut-wrap">
          <ResponsiveContainer initialDimension={{ width: 400, height: 252 }} width="100%" height="100%">
            <PieChart>
              <Pie
                data={[
                  { name: "Used", value: 68 },
                  { name: "Free", value: 32 },
                ]}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="78%"
                startAngle={90}
                endAngle={-270}
                paddingAngle={3}
                stroke="none"
              >
                <Cell fill="#ff6a2a" />
                <Cell fill="var(--chart-track)" />
              </Pie>
              <Tooltip {...tooltipMotion} content={<ChartTip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="donut-center">
            <strong>68%</strong>
            <span>34.2 GB</span>
          </div>
        </div>
      </ChartCard>

      <ChartCard
        title="Chart tooltip"
        eyebrow="Interactive detail"
        summary="Hover bars"
        className="tooltip-chart-card"
      >
        <ResponsiveContainer initialDimension={{ width: 400, height: 252 }} width="100%" height="100%">
          <BarChart data={activityData.slice(2)} margin={{ top: 10, right: 8, left: -20, bottom: 2 }}>
            <CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="3 5" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={axis} />
            <YAxis axisLine={false} tickLine={false} tick={axis} />
            <Tooltip
              {...tooltipMotion}
              content={<ChartTip />}
              cursor={{ fill: "var(--chart-hover)", radius: 6 }}
            />
            <Bar dataKey="current" name="This year" fill="#ff6a2a" radius={[5, 5, 2, 2]} barSize={16} />
            <Bar dataKey="previous" name="Last year" fill="#559bff" radius={[5, 5, 2, 2]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
