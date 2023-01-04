import mongoose from "mongoose";
mongoose
  .connect("mongodb://127.0.0.1:27017/plans")
  .then(() => console.log("MONGODB - Connected to plans collection!"));

export const db = mongoose.connection;
