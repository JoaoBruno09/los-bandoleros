import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/?readPreference=primaryPreferred");

export const db = mongoose.connection;
