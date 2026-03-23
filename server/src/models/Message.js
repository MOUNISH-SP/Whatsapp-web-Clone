import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Core payload constraints mapped accurately!
    text: { type: String, default: '' },
    type: { type: String, enum: ['text', 'audio', 'file'], default: 'text' },
    
    // File dependencies
    fileUrl: { type: String },
    fileName: { type: String },
    fileSize: { type: Number },
    duration: { type: Number }, // seconds tracking for audio specifically
    
    status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
    deliveredAt: { type: Date },
    readAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);
