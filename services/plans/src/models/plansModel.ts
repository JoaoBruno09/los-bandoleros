/*

interface Plan {
  plan: string;
  description: string;
  number_of_minutes: string;
  maximum_number_of_users_devices: number;
  music_collections: number;
  music_suggestions: string;
  monthly_fee: number;
  anual_fee: number;
}

const planSchema = new mongoose.Schema<Plan>({
  plan: { type: String, required: true },
  description: { type: String, required: true },
  number_of_minutes: { type: String, required: false, default: "Unlimited" },
  maximum_number_of_users_devices: { type: Number, required: true },
  music_collections: { type: Number, required: false, default: 0 },
  music_suggestions: { type: String, required: true },
  monthly_fee: { type: Number, required: true },
  anual_fee: { type: Number, required: true },
});

export const planModel = mongoose.model<Plan>("Plan", planSchema);
*/
