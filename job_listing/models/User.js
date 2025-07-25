import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'employee', 'hr-manager', 'manager'],
    required: true
  },
  name: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true }
}, {
  timestamps: true
});


// Avoid model overwrite issue in dev with hot reload
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
