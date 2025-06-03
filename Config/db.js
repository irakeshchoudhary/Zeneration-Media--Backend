import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
}; 