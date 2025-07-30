import mongoose, { Schema, model, models } from 'mongoose';

const LeaveRequestSchema = new Schema({
  employeeId: String,
  employeeName: String,
  leaveType: String,
  startDate: String,
  endDate: String,
  reason: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  requestDate: String,
});

const LeaveRequest = models.LeaveRequest || model('LeaveRequest', LeaveRequestSchema);
export default LeaveRequest;
