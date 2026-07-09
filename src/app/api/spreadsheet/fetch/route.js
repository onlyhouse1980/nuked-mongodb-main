import { NextResponse } from 'next/server';

import { getAdminSession } from '@/lib/auth';
import { getMongoClient } from '@/lib/mongodb';
import { spreadsheetFallback } from '@/data/fallbackReadings';

export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  let data = spreadsheetFallback;

  try {
    const client = await getMongoClient();

    if (client) {
      const db = client.db('meter');
      const collection = db.collection('readings');
      data = await collection.find({}).sort({ _id: 1 }).toArray();
      console.log('Data fetched from MongoDB:', data.length);
    } else {
      console.warn('MongoDB unavailable; serving fallback spreadsheet data.');
    }
  } catch (error) {
    console.error('Error fetching data; serving fallback instead:', error);
  }

  return NextResponse.json(data, { status: 200 });
}
