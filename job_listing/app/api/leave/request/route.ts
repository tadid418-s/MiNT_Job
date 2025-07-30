import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import LeaveRequest from '../../../../models/LeaveRequest';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const data = await req.json();

    const savedRequest = await LeaveRequest.create({
      ...data,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    });

    return NextResponse.json(savedRequest);
  } catch (error) {
    console.error('Leave request error:', error);
    return NextResponse.json({ error: 'Failed to submit leave request' }, { status: 500 });
  }
}
