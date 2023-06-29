import mongoose from 'mongoose';
export const connectDb = async (): Promise<void> => {
  const MONGO_URI: string =
    'mongodb+srv://icerock10:markeloff123@aroma.6hmchiw.mongodb.net/?retryWrites=true&w=majority';
  try {
    await mongoose.connect(MONGO_URI);
    console.log('mongoDB connected');
  } catch (e) {
    console.log('Error with database', e);
  }
};