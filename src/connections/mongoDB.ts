import mongoose from 'mongoose';

export async function connectMongoDB(URL: string): Promise<void> {
    try {
        await mongoose.connect(URL);
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB Connection Failed:', error);
        throw error;
    }
}
