import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  bio: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true }); 

const User = model("User", userSchema);

export default User;
