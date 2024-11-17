'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';
import { mockFetchTopProducts } from '@/constants/mock-api';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

type ChartConfigType = {
  [key: string]: {
    label: string;
    color: string;
  };
};

const generateRandomColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return `#${randomColor}`;
};

export function TopProducts() {
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [chartConfig, setChartConfig] = React.useState<ChartConfigType>({});
  const [isLoading, setIsLoading] = React.useState(true);

  const totalRevenue = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.revenue, 0);
  }, [chartData]);

  const formatRupiah = (value: number): string => {
    return value.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const fetchedProducts = await mockFetchTopProducts();
  
      const transformedData = fetchedProducts.map((product) => ({
        productName: product.name,
        revenue: product.revenue, 
        sales: product.sales,
        growth: product.growth,
        fill: generateRandomColor()
      }));
  
      const dynamicConfig: ChartConfigType = fetchedProducts.reduce((config, product) => {
        config[product.name] = {
          label: `Product: ${product.name} | Revenue: ${formatRupiah(
            product.revenue
          )} | Sales: ${product.sales} | Growth: ${product.growth}%`,
          color: `hsl(var(--chart-${fetchedProducts.indexOf(product) + 1}))`
        };
        return config;
      }, {} as ChartConfigType); // Type assertion to ensure correct type
  
      setChartData(transformedData);
      setChartConfig(dynamicConfig);
      setIsLoading(false);
    };
  
    fetchData();
  }, []);
  

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top Products</CardTitle>
        <CardDescription>Oct - Nov 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[360px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
                
              />
              <Pie
                data={chartData}
                dataKey="growth"
                nameKey="productName"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalRevenue.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Revenue
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 8.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total revenue for the last a month(s)
        </div>
      </CardFooter>
    </Card>
  );
}
