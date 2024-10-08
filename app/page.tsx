import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-4xl font-bold mb-8">Sales Data Management System</h1>
      <div className="space-y-4">
        <Button asChild className="w-full max-w-xs">
          <Link href="/enter-sale">Enter New Sale</Link>
        </Button>
        <Button asChild variant="outline" className="w-full max-w-xs">
          <Link href="/view-sales">View Sales</Link>
        </Button>
        <Button asChild variant="secondary" className="w-full max-w-xs">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}