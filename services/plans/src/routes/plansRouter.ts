import { Router } from "express";
import { authenticateJWT } from "../middlewares/Auth";
//import { planModel } from "../models/plansModel";
import plans from "../config/plans.json";

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
  //const plans = planModel.find();
  //res.json(plans);
  res.status(200).json({
    messsage: "GET - GET ALL PLANS",
    plans: plans,
  });
});

//GET - GET PLAN
planRouter.get("/:id", (req, res) => {
  const plan = plans.filter((plan) => plan.id === Number(req.params.id));
  res.status(200).json({
    message: `GET - GET PLAN ${req.params.id}`,
    plan: plan,
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
