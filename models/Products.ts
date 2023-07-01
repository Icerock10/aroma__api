import { model, Schema } from 'mongoose';
import { PRODUCT_SCHEMA_NAME } from '../common/constants/constants';
import { Product } from '../common/interfaces/interfaces';

const productSchema = new Schema<Product>({
  imageName: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subTitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  productProfile: {
    type: String,
    required: true,
  },
  indication: {
    type: String,
    required: true,
  },
  burnTime: Number
});

export const Products = model<Product>(PRODUCT_SCHEMA_NAME, productSchema);
