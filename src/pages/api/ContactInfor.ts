import clientPromise from '@/Lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
   
    const {
      companyName,
      representative,
      location,
      industry,
      requestedService,
      description,
      contact,
      email,
    } = await req.json();

    if (!companyName || !email) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

 
    const db = (await clientPromise).db('CurateInformation');
    const result = await db.collection('Contacts').insertOne({
      companyName,
      representative,
      location,
      industry,
      requestedService,
      description,
      contact,
      email,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
  } catch (error: any) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { success: false, error: error.message ?? 'Internal error' },
      { status: 500 },
    );
  }
}
