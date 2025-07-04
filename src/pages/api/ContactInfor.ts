import clientPromise from '@/Lib/db';
import { NextRequest, NextResponse } from 'next/server';


export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'https://curatehealthservices.com',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

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
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': 'https://curatehealthservices.com',
          },
        }
      );
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

    return NextResponse.json(
      { success: true, id: result.insertedId },
      {
        status: 201,
        headers: {
          'Access-Control-Allow-Origin': 'https://curatehealthservices.com',
        },
      }
    );
  } catch (error: any) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { success: false, error: error.message ?? 'Internal error' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': 'https://curatehealthservices.com',
        },
      }
    );
  }
}