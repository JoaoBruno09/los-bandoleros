import mongoose, { Date } from "mongoose";

export enum musicSuggestionsEnum {
  automatic = "automatic",
  personalized = "personalized",
}

export interface Subscription {
  SID: string;
  isYear: boolean;
  startDate: Date;
  endDate: Date;
  user:{
    UID:string,
    username:string;
    email:string 
  }
}

const subscriptionSchema = new mongoose.Schema<Subscription>({
  SID: { type: String, required: true },
  isYear: { type: Boolean, required: true },
  startDate: { type: String, required: false, default: "" },
  endDate: { type: String, required: false, default: "Unlimited" },
  user: { type: Document, required: true },
  
},{collection:"subsciption"});

export const subscriptionModel = mongoose.model<Subscription>("Subscription", subscriptionSchema);
