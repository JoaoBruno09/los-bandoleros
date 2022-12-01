import { Router } from "express";
import { authenticateJWT } from "../middlewares/Auth";
import { planModel } from "../models/Plan";
//import plans from "../config/plans.json";

export const planRouter = Router();

//PLANS ROUTES
planRouter.get("/", (req, res) => {
  //const plans = planModel.find();
  //res.json(plans);
  res.status(200).json();
});

planRouter.post("/", authenticateJWT, (req, res) => {
  res.status(200).json({
    message: "POST - CREATE NEW PLAN",
  });
});
