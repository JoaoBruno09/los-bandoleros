import { Router } from "express";
import { authenticateJWT } from "../middlewares/Auth";
import { planModel, Plan, musicSuggestionsEnum } from "../models/plansModel";
import plans from "../config/plans.json";
import { db } from "../config/DatabaseConfig";

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
  const planIndex = plans.findIndex((plan) => plan.PID === req.params.id);
  if (planIndex >= 0) plans[planIndex].isActive = false;
  res.status(200).json({
    message: `DELETE - DEACTIVATE PLAN ${req.params.id}`,
    plans: plans,
  });
});

//PUT - UPDATE PLAN 1.3
planRouter.put("/:id", authenticateJWT, (req, res) => {
  const planIndex = plans.findIndex((plan) => plan.PID === req.params.id);
  if (planIndex >= 0) plans[planIndex].name = req.body.plan;
  res.status(200).json({
    message: `PUT - UPDATE PLAN ${req.params.id}`,
    plans: plans,
  });
});

//GET - GET ALL PLANS 1.4
planRouter.get("/", (req, res) => {
  if (db) {
    planModel.find({}, { _id: 0, isActive: 0 }).then((plan) => {
      res.status(200).json({
        plans: plan,
      });
    });
  } else {
    res.status(500).send();
  }
});

//GET - GET PLAN
planRouter.get("/:PID", (req, res) => {
  if (db) {
    planModel
      .find({ PID: req.params.PID }, { _id: 0, isActive: 0 })
      .then((plan) => {
        res.status(200).json(plan);
      });
  } else {
    res.status(500).send();
  }
});

//GET - GET PLAN
planRouter.get("/:id/history", (req, res) => {
  const plan = plans.filter((plan) => plan.PID === req.params.id);
  res.status(200).json({
    message: `GET - GET PLAN ${req.params.id}`,
    plan: plan,
  });
});
