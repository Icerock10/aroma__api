import { model, Schema } from "mongoose";

const productSchema = new Schema({
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
  burnTime: {
    type: Number,
    required: true,
  },
  indication: {
    type: String,
    required: true,
  },
});

export const Products = model("Products", productSchema);
