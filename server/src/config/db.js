import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Fallback natively to chat_assignment to avoid legacy chatapp database collisions
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chat_assignment');
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Safely drop the legacy OTP/Email unique index from the database if you are still pointing your .env to the old chatapp DB!
        // This permanently resolves the E11000 dup key { email: null } crash.
        try {
            await mongoose.connection.collection('users').dropIndex('email_1');
            console.log("Successfully dropped legacy 'email_1' unique index from MongoDB!");
        } catch (indexError) {
            // Catch safely: Error Code 27 means the index was already dropped or doesn't exist
            if (indexError.code !== 27) {
                console.log("Note: Could not drop email_1 index natively. It may already be removed.");
            }
        }

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
