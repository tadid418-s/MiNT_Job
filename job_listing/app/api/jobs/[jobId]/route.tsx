// pages/api/jobs/[jobId].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import Job from '@/models/Job';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  const { jobId } = req.query;

  try {
    switch (req.method) {
      case 'GET':
        const job = await Job.findById(jobId);
        return res.status(200).json(job);

      case 'PUT':
        const updated = await Job.findByIdAndUpdate(jobId, req.body, { new: true });
        return res.status(200).json(updated);

      case 'DELETE':
        await Job.findByIdAndDelete(jobId);
        return res.status(204).end();

      default:
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
}
