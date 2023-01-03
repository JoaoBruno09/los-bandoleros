import { Router } from "express";
import { authenticateJWT } from "../middlewares/Auth";
//import { planModel } from "../models/plansModel";
import plans from "../config/plans.json";

import mongoose from "mongoose";
mongoose
  .connect("mongodb://127.0.0.1:27017/plans")
  .then(() => console.log("MONGODB - Connected!"));

const Schema = mongoose.Schema;
///const ObjectId = Schema.ObjectId;
const plansSchema = new Schema(
  {
    PID: String,
    name: String,
    description: String,
    numberOfMinutes: String,
    maximumNumberOfUsersDevices: String, // int32
    musicCollections: String, //int32
    musicSuggestions: String,
    monthlyFee: String, // double int 32
    anualFee: String, //double int32
    isPromoted: Boolean,
    isActive: Boolean,
  },
  { collection: "plans" }
);

const Plans = mongoose.model("Plans", plansSchema);

export const planRouter = Router();

//PLANS ROUTES

//POST - CREATE NEW PLAN 1.1
planRouter.post("/", authenticateJWT, (req, res) => {
  // GENERATE PID
  /*
  crypto.generateKey("hmac", { length: 40 }, (err, key) => {
    if (err) throw err;
    console.log("P" + key.export().toString("hex"));
  });
  */
  plans.push(req.body);
  res.status(200).json({
    message: "POST - CREATE NEW PLAN",
    plans: plans,
  });
});

//DELETE - DEACTIVATE PLAN 1.2
planRouter.delete("/:id", (req, res) => {
  const planIndex = plans.findIndex(
    (plan) => plan.id === Number(req.params.id)
  );
  if (planIndex >= 0) plans[planIndex].status = false;
  res.status(200).json({
    message: `DELETE - DEACTIVATE PLAN ${req.params.id}`,
    plans: plans,
  });
});

//PUT - UPDATE PLAN 1.3
planRouter.put("/:id", authenticateJWT, (req, res) => {
  const planIndex = plans.findIndex(
    (plan) => plan.id === Number(req.params.id)
  );
  if (planIndex >= 0) plans[planIndex].plan = req.body.plan;
  res.status(200).json({
    message: `PUT - UPDATE PLAN ${req.params.id}`,
    plans: plans,
  });
});

//GET - GET ALL PLANS 1.4
planRouter.get("/", (req, res) => {
  Plans.find().then(function (docs) {
    res.status(200).json({
      messsage: "GET - GET ALL PLANS",
      plans: docs,
    });
  });
});

//GET - GET PLAN
planRouter.get("/:PID", (req, res) => {
  /*const plan = plans.filter((plan) => plan.id === Number(req.params.id));
  res.status(200).json({
    message: `GET - GET PLAN ${req.params.id}`,
    plan: plan,
  });*/
  Plans.find({PID:req.params.PID}).then(function (plan) {
    res.status(200).json({
      messsage: "GET - GET ALL PLANS",
      plans: plan,
    });
  });

});

//GET - GET PLAN
planRouter.get("/:id/history", (req, res) => {
  const plan = plans.filter((plan) => plan.id === Number(req.params.id));
  res.status(200).json({
    message: `GET - GET PLAN ${req.params.id}`,
    plan: plan,
  });
});
