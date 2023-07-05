import { model, Schema } from 'mongoose';
import { USER_SCHEMA_NAME } from '../common/constants/constants';
import { IUser } from '../common/interfaces/interfaces';

const userSchema = new Schema<IUser>({
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
  location: String,
  jobPosition: String,
  avatar: String,
  avatarUrl: String,
});

export const User = model<IUser>(USER_SCHEMA_NAME, userSchema);
