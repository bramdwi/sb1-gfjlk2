'use client';

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface SaleItem {
  id: string;
  itemName: string;
  itemType: string;
  purchasePrice: number;
  sellingPrice: number;
  purchaseDate: string;
  deliveryDate: string;
}

export default function ViewSalesPage() {
  const [sales, setSales] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    async function fetchSales() {
      const response = await fetch('/api/sales');
      const data = await response.json();
      setSales(data);
    }
    fetchSales();
  }, []);

  const filteredSales = sales.filter(sale =>
    sale.itemName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === 'all' || sale.itemType === filterType)
  );

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">View Sales</h1>
        <div className="space-x-2">
          <Button asChild variant="outline">
            <Link href="/">Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/enter-sale">New Sale</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
      <div className="flex space-x-4 mb-4">
        <Input
          placeholder="Search by item name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="clothing">Clothing</SelectItem>
            <SelectItem value="furniture">Furniture</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Purchase Price</TableHead>
            <TableHead>Selling Price</TableHead>
            <TableHead>Purchase Date</TableHead>
            <TableHead>Delivery Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>{sale.itemName}</TableCell>
              <TableCell>{sale.itemType}</TableCell>
              <TableCell>${sale.purchasePrice.toFixed(2)}</TableCell>
              <TableCell>${sale.sellingPrice.toFixed(2)}</TableCell>
              <TableCell>{new Date(sale.purchaseDate).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(sale.deliveryDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button asChild variant="link">
                  <Link href={`/view-sales/${sale.id}`}>View Details</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}