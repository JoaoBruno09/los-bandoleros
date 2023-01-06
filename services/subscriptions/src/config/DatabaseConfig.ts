import mongoose from "mongoose";
mongoose
  .connect("mongodb://127.0.0.1:27017/subscriptions")
  .then(() => console.log("MONGODB - Connected to subscriptions collection!"));

export const db = mongoose.connection;
