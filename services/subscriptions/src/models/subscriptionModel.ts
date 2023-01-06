import mongoose, { Date, Document } from "mongoose";

export enum musicSuggestionsEnum {
  automatic = "automatic",
  personalized = "personalized",
}

export interface Subscription {
  SID: string;
  isYear: boolean;
  startDate: String;
  endDate: String;
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
  user: { type: Object, required: true },
  
});

export const subscriptionModel = mongoose.model<Subscription>("Subscription", subscriptionSchema);
