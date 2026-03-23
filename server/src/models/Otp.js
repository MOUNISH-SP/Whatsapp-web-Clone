import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, expires: '5m', default: Date.now } // Auto-delete after 5 minutes
});

export default mongoose.model('Otp', otpSchema);
