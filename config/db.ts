import mongoose from 'mongoose';
export const connectDb = async (): Promise<void> => {
  const MONGO_URI: string = process.env.MONGO_URI;
  try {
    await mongoose.connect(MONGO_URI);
    console.log('mongoDB connected');
  } catch (e) {
    console.log('Error with database', e);
  }
};