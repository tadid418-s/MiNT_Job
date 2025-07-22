// /app/api/jobs/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Job from '@/models/Job';

export async function GET() {
  try {
    // Make sure to wait for DB connection before querying
    await connectToDatabase();

    // Fetch all jobs sorted by newest first
    const jobs = await Job.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ message: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const requestData = await request.json();

    if (!requestData.title || !requestData.description) {
      return NextResponse.json(
        { message: 'Title and description are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Create new Job document
    const newJob = new Job({
      title: requestData.title,
      description: requestData.description,
      department: requestData.department || 'General',
      location: requestData.location || 'Remote',
      deadline:
        requestData.deadline ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      qualifications: requestData.qualifications || '',
      organization: requestData.organization || 'MInT',
      type: requestData.type,
      category: requestData.category,
      experiencelevel: requestData.experiencelevel,
      createdAt: new Date(),  // Ensure createdAt is set if your schema requires it
    });

    const savedJob = await newJob.save();

    return NextResponse.json(
      {
        message: 'Job created successfully',
        job: savedJob,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Job creation error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
