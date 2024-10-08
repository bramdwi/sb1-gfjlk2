'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface SaleItem {
  id: string;
  itemName: string;
  itemType: string;
  description: string;
  purchasePrice: number;
  sellingPrice: number;
  purchaseDate: string;
  deliveryDate: string;
  imageUrl?: string;
}

export default function SaleDetailPage() {
  const { id } = useParams();
  const [sale, setSale] = useState<SaleItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSaleDetail() {
      try {
        const response = await fetch(`/api/sales/${id}`);
        if (response.ok) {
          const data = await response.json();
          setSale(data);
        } else {
          throw new Error('Failed to fetch sale data');
        }
      } catch (error) {
        console.error('Error fetching sale data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSaleDetail();
  }, [id]);

  if (isLoading) {
    return <div className="container mx-auto p-8">Loading sale data...</div>;
  }

  if (!sale) {
    return <div className="container mx-auto p-8">Sale not found</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <Button asChild className="mb-4">
        <Link href="/view-sales">Back to Sales List</Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{sale.itemName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Item Type:</strong> {sale.itemType}</p>
              <p><strong>Description:</strong> {sale.description}</p>
              <p><strong>Purchase Price:</strong> ${sale.purchasePrice.toFixed(2)}</p>
              <p><strong>Selling Price:</strong> ${sale.sellingPrice.toFixed(2)}</p>
              <p><strong>Purchase Date:</strong> {new Date(sale.purchaseDate).toLocaleDateString()}</p>
              <p><strong>Delivery Date:</strong> {new Date(sale.deliveryDate).toLocaleDateString()}</p>
            </div>
            <div>
              {sale.imageUrl && (
                <img src={sale.imageUrl} alt={sale.itemName} className="w-full h-auto rounded-lg" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}