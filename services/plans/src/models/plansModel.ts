import mongoose from "mongoose";

export enum musicSuggestionsEnum {
  automatic = "automatic",
  personalized = "personalized",
}

export interface Plan {
  PID: string;
  name: string;
  description?: string;
  numberOfMinutes?: String;
  maximumNumberOfUsersDevices: number;
  musicCollections?: number;
  musicSuggestions: musicSuggestionsEnum;
  monthlyFee: number;
  annualFee: number;
  isPromoted?: boolean;
  isActive?: boolean;
  priceHistory?: [];
}

const planSchema = new mongoose.Schema<Plan>({
  PID: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: false, default: "" },
  numberOfMinutes: { type: String, required: false, default: "Unlimited" },
  maximumNumberOfUsersDevices: { type: Number, required: true },
  musicCollections: { type: Number, required: false, default: 0 },
  musicSuggestions: { type: String, required: true },
  monthlyFee: { type: Number, required: true },
  annualFee: { type: Number, required: true },
  isPromoted: { type: Boolean, required: false, default: false },
  isActive: { type: Boolean, required: false, default: true },
  priceHistory: { type: Array, required: false },
});

export const planModel = mongoose.model<Plan>("Plan", planSchema);
