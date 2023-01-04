import mongoose from "mongoose";

export interface User {
  UID: string;
  name: string;
  username: string;
  email: string;
  password: string;
  role: string;
}

const userSchema = new mongoose.Schema<User>({
  UID: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: false },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

export const authModel = mongoose.model<User>("User", userSchema);
