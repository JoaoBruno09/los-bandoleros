import { Router } from "express";

export const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "GET ALL PLANS",
  });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  res.status(200).json({
    message: "POST - CREATE NEW PLAN",
    id: id,
  });
});
