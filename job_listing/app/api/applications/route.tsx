// /app/api/apply/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();

    const fullName = data.get('fullName') as string;
    const email = data.get('email') as string;
    const phone = data.get('phone') as string;
    const coverLetter = data.get('coverLetter') as string;
    const portfolio = data.get('portfolio') as string;
    const cvFile = data.get('cv') as File;
    const jobTitle = data.get('jobTitle') as string;  // <-- get jobTitle here
    const jobId = data.get('jobId') as string;        // optionally keep jobId if you want

    // Convert file to base64
    const buffer = Buffer.from(await cvFile.arrayBuffer());
    const base64CV = buffer.toString('base64');

    await client.connect();
    const db = client.db();
    const applications = db.collection('applications');

    await applications.insertOne({
      fullName,
      email,
      phone,
      coverLetter,
      portfolio,
      jobId,        // save jobId
      jobTitle,     // save jobTitle
      cvFile: {
        name: cvFile.name,
        type: cvFile.type,
        size: cvFile.size,
        content: base64CV,
      },
      appliedAt: new Date(),
      status: 'Applied',  // optionally add initial status
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Failed to submit application' }, { status: 500 });
  } finally {
    // Don't close client if you use a cached client pattern
    // await client.close();
  }
}

export async function GET() {
  try {
    await client.connect();
    const db = client.db();
    const applications = db.collection('applications');

    // Fetch all applications sorted by appliedAt descending
    const applicants = await applications.find().sort({ appliedAt: -1 }).toArray();

    // Remove large content field (CV base64) if you want to keep response lighter
    const safeApplicants = applicants.map(({ cvFile, ...rest }) => rest);

    return NextResponse.json(safeApplicants);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch applicants' }, { status: 500 });
  } finally {
    //await client.close();
  }
}