import { Router } from "express";
import { authenticateJWT } from "../middlewares/Auth";

export const router = Router();

//PLANS ROUTES
router.get("/", (req, res) => {
  res.status(200).json({
    message: "GET ALL PLANS",
  });
});

router.post("/", authenticateJWT, (req, res) => {
  res.status(200).json({
    message: "POST - CREATE NEW PLAN",
  });
});
