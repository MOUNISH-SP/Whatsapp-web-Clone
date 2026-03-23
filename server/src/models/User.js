import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String }, // Not required for groups
    uniqueId: { type: String, default: () => Math.random().toString(36).substring(2, 10).toUpperCase() },
    about: { type: String, default: 'Available' },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    isGroup: { type: Boolean, default: false },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
