import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { getRequest } from '@/Service/Apiservice';

type TimeRange = 'day' | 'week' | 'month';

interface RevenueEntry {
  timeUnit: string;
  revenue: number;
  [key: string]: unknown;
}

interface ChartData {
  label: string;
  data: RevenueEntry[];
}

interface PeriodsData {
  daily: RevenueEntry[];
  weekly: RevenueEntry[];
  monthly: RevenueEntry[];
}

const currencyFormatter = (value: number | null) =>
  value == null ? '—' : `£${value.toLocaleString()}`;

export default function RevenueChart() {
  const [timeRange, setTimeRange] = React.useState<TimeRange>('week');
  const [chartData, setChartData] = React.useState<ChartData | null>(null);
  const [allPeriods, setAllPeriods] = React.useState<PeriodsData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

React.useEffect(() => {
  setLoading(true);
  setError(null);

  getRequest('admin/revenue')
    .then((res) => {
      console.log('[API RESPONSE FULL]', res);
      console.log('[API DATA]', res.data);

      const response = res.data;

      if (!response || !response.success || !response.data) {
        setError("Invalid or empty response from server");
        return;
      }

      const periods = response.data.periods;

      if (!periods) {
        console.log("No 'periods' key found in response.data", response.data);
        setError("Could not find period statistics in the response");
        return;
      }

      const dailyData: RevenueEntry[] = [];
      const weeklyData: RevenueEntry[] = [];
      const monthlyData: RevenueEntry[] = [];

      // Daily → Mon, Tue, ...
      if (periods.daily_this_week) {
        Object.entries(periods.daily_this_week).forEach(([day, stats]: [string, any]) => {
          dailyData.push({
            timeUnit: day.slice(0, 3), // "Monday" → "Mon"
            revenue: Number(stats?.total_payments ?? 0),
          });
        });
      }

      // Weekly → Week 1, Week 2, ...
      if (periods.weekly_this_month) {
        Object.entries(periods.weekly_this_month).forEach(([weekKey, stats]: [string, any]) => {
          const weekNum = weekKey.replace('week', '');
          weeklyData.push({
            timeUnit: `Week ${weekNum}`,
            revenue: Number(stats?.total_payments ?? 0),
          });
        });
      }

      // Monthly → Jan, Feb, Mar, ...
      if (periods.monthly_this_year) {
        Object.entries(periods.monthly_this_year).forEach(([month, stats]: [string, any]) => {
          const shortMonth = month.slice(0, 3); // "January" → "Jan"
          monthlyData.push({
            timeUnit: shortMonth,
            revenue: Number(stats?.total_payments ?? 0),
          });
        });
      }

      console.log('Daily data:', dailyData);
      console.log('Weekly data:', weeklyData);
      console.log('Monthly data:', monthlyData);

      setAllPeriods({ daily: dailyData, weekly: weeklyData, monthly: monthlyData });

      // Set initial view
      let selected: RevenueEntry[] = [];
      let label = "";

      if (timeRange === "day") {
        selected = dailyData;
        label = "Daily Revenue (This Week)";
      } else if (timeRange === "week") {
        selected = weeklyData;
        label = "Weekly Revenue (This Month)";
      } else {
        selected = monthlyData;
        label = "Monthly Revenue (This Year)";
      }

      setChartData({ label, data: selected });
    })
    .catch((err) => {
      console.error("API request failed:", err);
      setError("Failed to load revenue data");
    })
    .finally(() => {
      setLoading(false);
    });
}, []);

  // Update chart when timeRange changes
  React.useEffect(() => {
    if (!allPeriods) return;

    let selectedData: RevenueEntry[] = [];
    let label = '';

    if (timeRange === 'day') {
      selectedData = allPeriods.daily;
      label = 'Daily Revenue (This Week)';
    } else if (timeRange === 'week') {
      selectedData = allPeriods.weekly;
      label = 'Weekly Revenue (This Month)';
    } else {
      selectedData = allPeriods.monthly;
      label = 'Monthly Revenue (This Year)';
    }

    setChartData({ label, data: selectedData });
  }, [timeRange, allPeriods]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    setTimeRange(event.target.value as TimeRange);
  };

  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography mt={2}>Loading revenue data...</Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  if (!chartData || chartData.data.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="info">No revenue data available for this period</Alert>
      </Paper>
    );
  }

  const totalRevenue = chartData.data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <Paper elevation={3} sx={{ p: 3, mx: 'auto', borderRadius: 3, maxWidth: 1400 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="h6" component="h2" fontWeight={600}>
          {chartData.label}
        </Typography>

        <FormControl variant="outlined" size="small" sx={{ minWidth: 160 }}>
          <InputLabel
            id="time-range-select-label"
            sx={{ '&.Mui-focused': { color: 'var(--color-purple)' } }}
          >
            Period
          </InputLabel>
          <Select
            labelId="time-range-select-label"
            value={timeRange}
            label="Period"
            onChange={handleChange}
            sx={{
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.500' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'grey.700' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--color-purple)',
                borderWidth: '2px',
              },
            }}
          >
            <MenuItem value="day">Daily (This Week)</MenuItem>
            <MenuItem value="week">Weekly (This Month)</MenuItem>
            <MenuItem value="month">Monthly (This Year)</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Typography variant="h4" fontWeight={700} mb={4} textAlign="center">
        {currencyFormatter(totalRevenue)}
      </Typography>

      <Box
        sx={{
          width: '100%',
          height: { xs: 340, sm: 400, md: 460, lg: 500 },
          minHeight: 320,
        }}
      >
        <BarChart
          height={450}
          dataset={chartData.data}
          xAxis={[
            {
              scaleType: 'band',
              dataKey: 'timeUnit',
              label: chartData.label.replace(/ Revenue.*$/, ''),
              labelStyle: { fontSize: 15, fontWeight: 600, transform: 'translateY(20px)' },
              tickLabelStyle: {
                angle: chartData.data.length > 7 ? -45 : 0,
                textAnchor: chartData.data.length > 7 ? 'end' : 'middle',
                fontSize: 13,
                fontWeight: 500,
              },
              tickPlacement: 'middle',
            },
          ]}
          yAxis={[{ label: '', valueFormatter: () => '', tickSize: 0, disableLine: true }]}
          series={[
            {
              dataKey: 'revenue',
              label: 'Revenue',
              color: 'var(--color-purple)',
              valueFormatter: currencyFormatter,
            },
          ]}
          margin={{ top: 30, right: 30, bottom: 110, left: 80 }}
          grid={{ horizontal: true }}
          borderRadius={4}
          sx={{
            '& .MuiChartsAxis-tickLabel': {
              fill: 'text.primary !important',
              opacity: 1,
            },
          }}
        />
      </Box>
    </Paper>
  );
}