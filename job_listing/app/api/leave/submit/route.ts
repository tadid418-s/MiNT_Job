import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

import Leave from '../../../../models/Leave';
export async function POST(req: NextRequest) {
  try {
    const { employeeId, leaveType, startDate, endDate, reason } = await req.json();

    if (!employeeId || !leaveType || !startDate || !endDate || !reason) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }

    await connectToDatabase();

    const newLeave = new Leave({
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason,
      status: 'pending',
    });

    await newLeave.save();

    return NextResponse.json({ success: true, message: 'Leave request submitted successfully' });
  } catch (error) {
    console.error('Error submitting leave:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
