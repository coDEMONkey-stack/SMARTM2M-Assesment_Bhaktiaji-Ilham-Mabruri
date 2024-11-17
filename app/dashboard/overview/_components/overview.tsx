'use client';
import html2canvas from 'html2canvas';
import { RevenueTrend } from './area-graph';
// import { BarGraph } from './bar-graph';
import { TopProducts } from './pie-graph';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import PageContainer from '@/components/layout/page-container';
import { RecentSales } from './recent-sales';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useSession } from 'next-auth/react';
import { useRef, useState, useEffect  } from 'react';
import { mockFetchDashboardStats } from '@/constants/mock-api';


export default function OverViewPage() {
  const { data: session } = useSession();
  const overviewRef = useRef<HTMLDivElement>(null);
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const stats = await mockFetchDashboardStats();
      setDashboardStats(stats);
    };
    fetchStats();
  }, []);

  const handleDownload = () => {
    if (overviewRef.current) {
      html2canvas(overviewRef.current, {
        useCORS: true,
      }).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'overview.png';
        link.click();
      });
    }
  };

  if (!dashboardStats) {
    return <div>Loading...</div>;
  }


  const {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    conversionRate,
    revenueGrowth,
    orderGrowth
  } = dashboardStats;


  if (session) {
    
    return (
      <PageContainer scrollable>
        <div className="space-y-2">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Hi, {session.user?.name} 👋
            </h2>
            <div className="hidden items-center space-x-2 md:flex">
              <CalendarDateRangePicker />
              <Button onClick={handleDownload}>Download</Button>
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsContent value="overview" className="space-y-4" ref={overviewRef}>
              <div className="grid gap-3 md:grid-cols-1 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Revenue
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Rp. {totalRevenue.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}                    </div>
                    <p className="text-xs text-muted-foreground">
                    + {conversionRate} % from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Orders
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalOrders} </div>
                    <p className="text-xs text-muted-foreground">
                    + {revenueGrowth}% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card className='lg:w-[325px] md:w-auto'>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{averageOrderValue}</div>
                    <p className="text-xs text-muted-foreground">
                      + {orderGrowth} % from last month
                    </p>
                  </CardContent>
                </Card>
                
                <div className="col-span-4">
                  <RevenueTrend />
                </div>

              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
         
                <div className="col-span-4 md:col-span-3">
                  <TopProducts />
                </div>

                <Card className="col-span-4 md:col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                    <CardDescription>
                      Showing sales, revenue, and percentage for the last 30 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentSales />
                  </CardContent>
                </Card>               
              </div>
              {/* <div className="col-span-4">
                <BarGraph />
              </div> */}
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>
    );
  }
}
