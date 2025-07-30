import mongoose from 'mongoose';

const LeaveSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  leaveType: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, default: 'pending' },
}, { timestamps: true });

export default mongoose.models.Leave || mongoose.model('Leave', LeaveSchema);
