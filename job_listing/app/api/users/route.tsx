import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const body = await request.json();

    // Validate required fields
    if (!body.employeeId || !body.role) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if employeeId is unique
    const existingUser = await User.findOne({ employeeId: body.employeeId });
    if (existingUser) {
      return NextResponse.json({ message: 'Employee ID already exists' }, { status: 409 });
    }

    const newUser = new User({
      employeeId: body.employeeId,
      role: body.role,
    });

    await newUser.save();

    // Return new user without sensitive fields
    return NextResponse.json({
      _id: newUser._id,
      employeeId: newUser.employeeId,
      role: newUser.role,
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
