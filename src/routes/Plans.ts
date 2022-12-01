import { Router } from "express";
import { authenticateJWT } from "../middlewares/Auth";
import plans from "../config/plans.json";

export const router = Router();

//PLANS ROUTES
router.get("/", (req, res) => {
  res.status(200).json({
    plans: plans,
  });
});

router.post("/", authenticateJWT, (req, res) => {
  res.status(200).json({
    message: "POST - CREATE NEW PLAN",
  });
});
