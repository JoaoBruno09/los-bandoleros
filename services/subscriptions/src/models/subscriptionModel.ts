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
  user: {
    UID: string;
    username: string;
    email: string;
  },
  plan: {
    PID: string;
    name: string;
    description: string;
    numberOfMinutes: String;
    maximumNumberOfDevices: number;
    musicCollections: number;
    musicSuggestions: musicSuggestionsEnum;
    monthlyFee: number;
    anualFee: number;
  },
  cancelled:Boolean,
  cancelled_date:string
}

const subscriptionSchema = new mongoose.Schema<Subscription>(
  {
    SID: { type: String, required: true },
    isYear: { type: Boolean, required: true },
    startDate: { type: String, required: false, default: "" },
    endDate: { type: String, required: false, default: "Unlimited" },
    user: { type: Object, required: true },
    plan:{type: Object, required: true},
    cancelled:{type: Boolean, required:true},
    cancelled_date:{type:String, required:false}

  },
  { collection: "subscriptions" }
);

export const subscriptionModel = mongoose.model<Subscription>(
  "Subscription",
  subscriptionSchema
);
/*----------*/
export interface Device {
  DID: string;
  device: string;
  esn: string;
  affiliatedOn: string;
  UID: string;
}

const deviceSchema = new mongoose.Schema<Device>(
  {
    DID: { type: String, required: true },
    device: { type: String, required: true },
    esn: { type: String, required: true },
    affiliatedOn: { type: String, required: true },
    UID: { type: String, required: true },
  },
  { collection: "devices" }
);

export const devicesModel = mongoose.model<Device>("Device", deviceSchema);
