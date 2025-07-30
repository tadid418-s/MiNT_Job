import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CalendarEvent from '@/models/CalendarEvent';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { employeeId, name, department, title, date, time, type } = body;

    if (!employeeId || !name || !department || !title || !date || !time || !type) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    await connectToDatabase();

    const event = new CalendarEvent({
      employeeId,
      name,
      department,
      title,
      date,
      time,
      type,
    });

    await event.save();

    return NextResponse.json({ message: 'Event scheduled successfully' });
  } catch (error) {
    console.error('Calendar save error:', error);
    return NextResponse.json({ message: 'Failed to save event' }, { status: 500 });
  }
}
