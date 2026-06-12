import { NextResponse } from 'next/server';

import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const connection = await dbConnect();
  if (!connection) {
    return NextResponse.json(
      { message: 'Database unavailable.' },
      { status: 503 },
    );
  }

  try {
    const user = await User.findById(userId).populate('readingIds');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        user: {
          username: user.username,
          waterReadings: user.readingIds,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('user/data error', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
