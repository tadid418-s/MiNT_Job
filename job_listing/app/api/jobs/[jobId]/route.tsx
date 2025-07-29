import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Job from '@/models/Job';

export async function GET(req: Request, { params }: { params: { jobId: string } }) {
  await connectToDatabase();

  try {
    const job = await Job.findById(params.jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    return NextResponse.json(job);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { jobId: string } }) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const updated = await Job.findByIdAndUpdate(params.jobId, body, { new: true });
    if (!updated) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { jobId: string } }) {
  await connectToDatabase();

  try {
    const deleted = await Job.findByIdAndDelete(params.jobId);
    if (!deleted) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
