import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// This is a mock database. In a real application, you'd use a proper database.
let sales: any[] = [];

export async function GET() {
  return NextResponse.json(sales);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const sale: any = {};

    for (const [key, value] of formData.entries()) {
      if (key === 'image' && value instanceof Blob) {
        try {
          const buffer = Buffer.from(await value.arrayBuffer());
          const filename = `${Date.now()}-${value.name}`;
          const uploadDir = path.join(process.cwd(), 'public', 'uploads');
          
          // Ensure the uploads directory exists
          await mkdir(uploadDir, { recursive: true });
          
          const filepath = path.join(uploadDir, filename);
          await writeFile(filepath, buffer);
          sale[key] = `/uploads/${filename}`;
        } catch (fileError) {
          console.error('Error processing file:', fileError);
          // If file processing fails, we'll still add the sale without the image
          sale[key] = null;
        }
      } else if (key === 'purchasePrice' || key === 'sellingPrice') {
        sale[key] = parseFloat(value as string);
      } else {
        sale[key] = value;
      }
    }

    sale.id = Date.now().toString(); // Generate a simple unique ID
    sales.push(sale);

    console.log('Sale added successfully:', sale);
    return NextResponse.json({ message: 'Sale added successfully', sale }, { status: 201 });
  } catch (error) {
    console.error('Error adding sale:', error);
    return NextResponse.json({ message: 'Failed to add sale', error: (error as Error).message }, { status: 500 });
  }
}