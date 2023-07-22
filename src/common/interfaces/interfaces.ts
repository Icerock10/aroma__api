import { Request } from 'express';
import { Document } from 'mongoose';

interface CustomRequest extends Request {
  email?: string;
  file?: {
    originalname: string;
    mimetype: string;
    buffer: Buffer;
  };
  headers: {
    authorization?: string;
  };
}

interface Product extends Document {
  imageName: string;
  imageUrl: string;
  category: string;
  title: string;
  subTitle: string;
  description: string;
  price: number;
  productProfile: string;
  burnTime?: number;
  indication: string;
  capacity?: string
}

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  location?: string;
  jobPosition?: string;
  avatar?: string;
  avatarUrl?: string;
}

export { CustomRequest, Product, IUser };