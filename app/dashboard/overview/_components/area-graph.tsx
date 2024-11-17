'use client';
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip } from 'recharts';
import { mockFetchRevenueTrend } from '@/constants/mock-api';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
} from '@/components/ui/chart';

const generateRandomColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return `#${randomColor}`;
};

export function RevenueTrend() {
  const [chartData, setChartData] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Simulate fetching data from the mock API
    const fetchData = async () => {
      const data = await mockFetchRevenueTrend();
      setChartData(data);
    };

    fetchData();
  }, []);

  const formatRupiah = (value: number): string => {
    return value.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Prepare chartConfig dynamically based on revenue data
  const chartConfig: ChartConfig = {
    revenue: {
      label: "Revenue",
      color: generateRandomColor(),
    },
    orders: {
      label: "Orders",
      color: generateRandomColor(),
    },
    customers: {
      label: "Customers",
      color: generateRandomColor(),
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trend</CardTitle>
        <CardDescription>
          Showing total revenue, orders, and customers for the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[310px] w-full"
        >
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === 'revenue') {
                  return [formatRupiah(value), chartConfig.revenue.label];
                }
                // Tetap gunakan nilai asli untuk data lain
                return [value, chartConfig[name as keyof ChartConfig]?.label || name];
              }}
            />

            <Area
              dataKey="revenue"
              type="natural"
              fill={chartConfig.revenue.color}
              fillOpacity={0.4}
              stroke={chartConfig.revenue.color}
              stackId="a"
            />
            <Area
              dataKey="orders"
              type="natural"
              fill={chartConfig.orders.color}
              fillOpacity={0.4}
              stroke={chartConfig.orders.color}
              stackId="a"
            />
            <Area
              dataKey="customers"
              type="natural"
              fill={chartConfig.customers.color}
              fillOpacity={0.4}
              stroke={chartConfig.customers.color}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 8.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Oct - Nov 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
