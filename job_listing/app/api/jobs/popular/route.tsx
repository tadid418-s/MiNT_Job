import { connectToDatabase } from '@/lib/mongodb';
import Job from '@/models/Job';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(4)
      .lean();  // recommended with Mongoose for plain JS objects

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching popular jobs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
