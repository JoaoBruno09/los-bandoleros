import mongoose from "mongoose";
mongoose
  .connect("mongodb://127.0.0.1:27017/users")
  .then(() => console.log("MONGODB - Connected to users collection!"));

export const db = mongoose.connection;
