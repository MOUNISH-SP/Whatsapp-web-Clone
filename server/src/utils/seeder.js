import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import Otp from '../models/Otp.js';

dotenv.config({ path: '../../.env' });

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chatapp');
        console.log("Connected to DB. Wiping existing data...");

        await User.deleteMany();
        await Chat.deleteMany();
        await Message.deleteMany();
        await Otp.deleteMany();

        await User.insertMany([
            { name: "Alice Smith", phoneNumber: "+11111111111", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice", about: "Available" },
            { name: "Bob Jones", phoneNumber: "+22222222222", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob", about: "Busy" },
            { name: "Charlie Brown", phoneNumber: "+33333333333", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie", about: "At the movies" }
        ]);

        console.log("-----------------------------------------");
        console.log("✅ Seed completed successfully!");
        console.log("Test accounts injected:");
        console.log("- +11111111111");
        console.log("- +22222222222");
        console.log("- +33333333333");
        console.log("💡 You can log in using these numbers. The OTP will be logged in the terminal (Local OTP mode).");
        console.log("-----------------------------------------");

        process.exit();
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seedDatabase();
