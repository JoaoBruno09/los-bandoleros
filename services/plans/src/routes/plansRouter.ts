import { Router } from "express";
import { authenticateJWT } from "../middlewares/Auth";
import { planModel, Plan, musicSuggestionsEnum } from "../models/plansModel";
import crypto from "crypto";
import plans from "../config/plans.json";
import { db } from "../config/DatabaseConfig";
import * as jwt from "jsonwebtoken";

const accessTokenSecret: string = "the-secret-key";
export const planRouter = Router();

//PLANS ROUTES

//POST - CREATE NEW PLAN 1.1
planRouter.post("/", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, accessTokenSecret, (err: any, user: any) => {
      if (user.role !== "Marketing Director") {
        res
          .status(401)
          .send("Unauthorized. You don't have access to this resource!");
      } else {
        crypto.generateKey("hmac", { length: 40 }, (err, key) => {
          if (err) throw err;
          const PID = "P" + key.export().toString("hex");
          const newPlan: Plan = {
            PID: PID,
            name: req.body.name,
            description: req.body.description,
            maximumNumberOfDevices: req.body.maximumNumberOfDevices,
            numberOfMinutes: req.body.numberOfMinutes,
            musicCollections: req.body.musicCollections,
            musicSuggestions: req.body.musicSuggestions,
            monthlyFee: req.body.monthlyFee,
            anualFee: req.body.anualFee,
          };

          if (
            newPlan.musicSuggestions === musicSuggestionsEnum.automatic ||
            newPlan.musicSuggestions === musicSuggestionsEnum.personalized
          ) {
            if (db) {
              planModel.create(newPlan).then(() => {
                planModel
                  .find({ PID: newPlan.PID }, { _id: 0, __v: 0 })
                  .then((plan) => {
                    res.status(201).json(plan);
                  });
              });
            } else {
              res.status(500).send("Internal Server Error");
            }
          } else {
            res.status(400).send("Bad Request");
          }
        });
      }
    });
  } else {
    res.status(401).send("Unauthorized. Access token is missing!");
  }
});

//GET - GET ALL PLANS 1.4
planRouter.get("/", (req, res) => {
  if (db) {
    planModel.find({ isActive: true }, { _id: 0, __v: 0 }).then((plan) => {
      if (plan.length > 0) {
        res.status(200).json({
          plans: plan,
        });
      } else {
        res.status(404).json("Not found. Plans not found or don't exist!");
      }
    });
  } else {
    res.status(500).send();
  }
});

//GET - GET PLAN
planRouter.get("/:PID", (req, res) => {
  if (db) {
    planModel
      .find({ PID: req.params.PID, isActive: true }, { _id: 0, __v: 0 })
      .then((plan) => {
        if (plan.length > 0) {
          res.status(200).json(plan);
        } else {
          res.status(404).json("Not found. Plan not found or doesn't exist!");
        }
      });
  } else {
    res.status(500).send();
  }
});

//PUT - DEACTIVATE PLAN 1.2
planRouter.put("/:PID", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, accessTokenSecret, (err: any, user: any) => {
      if (user.role !== "Marketing Director") {
        res
          .status(401)
          .send("Unauthorized. You don't have access to this resource!");
      } else {
        if (db) {
          planModel
            .findOneAndUpdate({ PID: req.params.PID }, { isActive: false })
            .then((response) => {
              if (!response?.$isEmpty) {
                planModel
                  .find({ PID: req.params.PID }, { _id: 0, __v: 0 })
                  .then((plan) => {
                    res.status(200).json(plan);
                  });
              } else {
                res
                  .status(404)
                  .json("Not found. Plan not found or doesn't exist!");
              }
            });
        } else {
          res.status(500).send();
        }
      }
    });
  } else {
    res.status(401).send("Unauthorized. Access token is missing!");
  }
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

//GET - GET PLAN
planRouter.get("/:id/history", (req, res) => {
  const plan = plans.filter((plan) => plan.PID === req.params.id);
  res.status(200).json({
    message: `GET - GET PLAN ${req.params.id}`,
    plan: plan,
  });
});
