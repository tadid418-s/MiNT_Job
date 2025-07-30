import mongoose from 'mongoose';

const LeaveRequestSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  leaveType: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, default: 'pending' },
}, { collection: 'leave' }); // Collection name is explicitly 'leave'

export default mongoose.models.LeaveRequest || mongoose.model('LeaveRequest', LeaveRequestSchema);
