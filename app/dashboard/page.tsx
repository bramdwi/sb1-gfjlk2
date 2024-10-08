'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface SaleItem {
  id: string;
  itemName: string;
  itemType: string;
  purchasePrice: number;
  sellingPrice: number;
  purchaseDate: string;
  deliveryDate: string;
}

export default function DashboardPage() {
  const [sales, setSales] = useState<SaleItem[]>([]);

  useEffect(() => {
    async function fetchSales() {
      const response = await fetch('/api/sales');
      const data = await response.json();
      setSales(data);
    }
    fetchSales();
  }, []);

  const totalSales = sales.reduce((sum, sale) => sum + sale.sellingPrice, 0);
  const totalProfit = sales.reduce((sum, sale) => sum + (sale.sellingPrice - sale.purchasePrice), 0);
  const averageProfit = totalProfit / sales.length || 0;

  const salesByType = sales.reduce((acc, sale) => {
    acc[sale.itemType] = (acc[sale.itemType] || 0) + sale.sellingPrice;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(salesByType).map(([type, amount]) => ({ type, amount }));

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sales Dashboard</h1>
        <div className="space-x-2">
          <Button asChild variant="outline">
            <Link href="/">Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/enter-sale">New Sale</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/view-sales">Sales</Link>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalSales.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalProfit.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Profit per Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${averageProfit.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Sales by Item Type</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="type" 
                tick={{ fontSize: 12 }}
                tickLine={{ display: 'none' }}
                axisLine={{ display: 'none' }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={{ display: 'none' }}
                axisLine={{ display: 'none' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}