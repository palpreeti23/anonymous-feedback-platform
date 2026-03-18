import mongoose, { Document, Schema } from "mongoose";

export interface Message extends Document {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
}

export const MessageSchema: Schema<Message> = new Schema({
  id: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  isVarified: boolean;
  verifyCodeExpiry: Date;
  isAcceptingMessages: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "please use a valid email adddress"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "verify code is required"],
  },
  isVarified: {
    type: Boolean,
    default: false,
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "verify code expiry is required"],
  },

  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },

  messages: [MessageSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
