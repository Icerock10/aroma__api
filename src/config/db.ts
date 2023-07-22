import mongoose from 'mongoose';
import { CommonMessages } from '../common/enums/common-express-enums';
export const connectDb = async (): Promise<void> => {
  const MONGO_URI: string = process.env.MONGO_URI;
  try {
    await mongoose.connect(MONGO_URI);
    console.log(CommonMessages.DATABASE_CONNECTED);
  } catch (e) {
    console.log(CommonMessages.DATABASE_ERROR, e);
  }
};