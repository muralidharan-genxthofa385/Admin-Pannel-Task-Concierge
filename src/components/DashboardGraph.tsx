"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, LabelList } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface graphprops {
  taskerCount: number | undefined;
  customerCount: number | undefined;
}

type Row = { date: string; desktop: number; mobile: number };

const chartData: Row[] = [
  // same dataset as before
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  // ... your full dataset here ...
  { date: "2024-06-30", desktop: 446, mobile: 400 },
];

const chartConfig = {
  visitors: { label: "Visitors" },
  desktop: { label: "Taskers", color: "var(--chart-1)" },
  mobile: { label: "Customers", color: "var(--chart-2)" },
} satisfies ChartConfig;

export default function DashboardGraph({
  taskerCount,
  customerCount,
}: graphprops) {
  const [timeRange, setTimeRange] = React.useState<"90d" | "30d" | "7d">("90d");

  // Filter daily rows according to timeRange
  const filteredDaily = React.useMemo(() => {
const referenceDate = new Date(chartData[chartData.length - 1].date);
    let daysToSubtract = 90;
    if (timeRange === "30d") daysToSubtract = 30;
    else if (timeRange === "7d") daysToSubtract = 7;
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return chartData.filter((row) => {
      const d = new Date(row.date);
      return d >= startDate && d <= referenceDate;
    });
  }, [timeRange]);

  // Aggregate by month (for 90d view)
  const aggregateByMonth = React.useCallback((data: Row[]) => {
    const grouped: Record<string, { desktop: number; mobile: number; firstDayIso: string }> = {};
    data.forEach((row) => {
      const d = new Date(row.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!grouped[key]) grouped[key] = { desktop: 0, mobile: 0, firstDayIso: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01` };
      grouped[key].desktop += row.desktop;
      grouped[key].mobile += row.mobile;
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([key, val]) => ({
        date: key,
        label: new Date(val.firstDayIso).toLocaleString("en-US", { month: "short", year: "numeric" }),
        desktop: val.desktop,
        mobile: val.mobile,
      }));
  }, []);

  // Choose display data (aggregated or daily)
  const displayData = React.useMemo(() => {
    if (timeRange === "90d") return aggregateByMonth(filteredDaily);
    return filteredDaily.map((row) => ({
      ...row,
      label: new Date(row.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }));
  }, [timeRange, filteredDaily, aggregateByMonth]);

  const tooltipLabelFormatter = (value: any) => (value ? String(value) : "");

  return (
    <Card className="w-full sm:w-full md:w-[49%] lg:w-[49%] pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Task Concierge Chart - Interactive</CardTitle>
          <CardDescription>Showing total Taskers and Customers for the selected period</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={(v) => setTimeRange(v as "90d" | "30d" | "7d")}>
          <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      {/* Numeric summary */}
      <div className="flex justify-around py-2 text-center">
        <div>
          <h3 className="text-sm text-gray-400">Taskers</h3>
          <p className="text-xl font-bold text-[var(--chart-1)]">{taskerCount ?? 0}</p>
        </div>
        <div>
          <h3 className="text-sm text-gray-400">Customers</h3>
          <p className="text-xl font-bold text-[var(--chart-2)]">{customerCount ?? 0}</p>
        </div>
      </div>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={displayData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={16} />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent labelFormatter={tooltipLabelFormatter} indicator="dot" />}
            />

            {/* Customers (mobile) */}
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--chart-2)"
              stackId="a"
            >
              <LabelList
                dataKey="mobile"
                position="top"
                formatter={() => `Cust: ${customerCount ?? 0}`}
              />
            </Area>

            {/* Taskers (desktop) */}
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--chart-1)"
              stackId="a"
            >
              <LabelList
                dataKey="desktop"
                position="top"
                formatter={() => `Taskers: ${taskerCount ?? 0}`}
              />
            </Area>

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
