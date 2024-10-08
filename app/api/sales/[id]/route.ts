import { NextResponse } from 'next/server';

// This is a mock database. In a real application, you'd use a proper database.
let sales: any[] = [];

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const sale = sales.find(s => s.id === id);
  
  if (sale) {
    return NextResponse.json(sale);
  } else {
    return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
  }
}