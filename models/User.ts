import { model, Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: false,
  },
  jobPosition: {
    type: String,
    required: false,
  },
  avatar: {
    type: String,
    required: false,
  },
  avatarUrl: {
    type: String,
    required: false,
  },
});

export const User = model("User", userSchema);
