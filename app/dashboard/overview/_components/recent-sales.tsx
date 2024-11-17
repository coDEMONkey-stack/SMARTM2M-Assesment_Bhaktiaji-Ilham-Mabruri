import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { mockFetchSalesByCategory } from '@/constants/mock-api';

type SalesData = {
  category: string;
  sales: number;
  revenue: number;
  percentage: number;
};

export function RecentSales() {
  const [data, setData] = useState<SalesData[]>([]); // Explicitly type the state

  useEffect(() => {
    const fetchData = async () => {
      const salesData = await mockFetchSalesByCategory();
      setData(salesData);
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
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-md border rounded text-sm">
          <p className="font-semibold">{payload[0].payload.category}</p>
        <p style={{ color: payload[0].fill }}>Sales: {payload[0].value}</p>
        <p style={{ color: payload[1].fill }}>Revenue: {formatRupiah(payload[1].value)}</p>
        <p style={{ color: payload[2].fill }}>Percentage: {payload[2].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="sales" fill="#d7d46e" name="Sales" />
          <Bar dataKey="revenue" fill="#8884d8" name="Revenue (Rp.)" />
          <Bar dataKey="percentage" fill="#82ca9d" name="Percentage (%)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}