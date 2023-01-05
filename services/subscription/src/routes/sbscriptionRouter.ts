import { Router } from "express";
import {
  subscriptionModel,
  Subscription,
  musicSuggestionsEnum,
} from "../models/sobscriptionModel";
import crypto from "crypto";
import { db } from "../config/DatabaseConfig";
import * as jwt from "jsonwebtoken";

const accessTokenSecret: string = "the-secret-key";
export const subscriptionRouter = Router();


  // POST - 2.1. As a new customer I want to subscribe to a plan
  subscriptionRouter.post("/plan/:PID", (req, res) => {});

  // PUT - 10.1. As subscriber I want to switch my plan (upgrade/downgrade)
  subscriptionRouter.put("/plan/:PID", (req, res) => {});

  // DELETE - 2.2. As subscriber I want to cancel my subscription
  subscriptionRouter.delete("/:UID", (req, res) => {});

  // GET - 2.3. As subscriber I want to know the details of my plan
  subscriptionRouter.get("/:UID", (req, res) => {
    if(db){
    subscriptionModel
      .find({ user: { UID: req.params.UID } })
      .then((sub) => {
        if (sub.length > 0) {
          res.status(200).json(sub);
        } else {
          res.status(404);
          //res.status(404).json("Not found. Plan not found or doesn't exist!");
        }
      });
    }else{

    }
  });

  // PUT - 10.2. As subscriber I want to renew my annual subscription
  subscriptionRouter.put("/:UID", (req, res) => {});

  // POST - 5.1 As subscriber I want to add a new device to my subscription
  subscriptionRouter.post("/:UID/devices", (req, res) => {});

  // GET - 5.4 As subscriber I want to list my devices
  subscriptionRouter.get("/:UID/devices", (req, res) => {});
  // DELETE - 5.2. As subscriber I want to remove a device from my subscription
  subscriptionRouter.delete("/:UID/devices/{DID}", (req, res) => {});
  // PUT - 5.3. As subscriber I want to update the details of my device (name and description)
  subscriptionRouter.put("/:UID/devices/{DID}", (req, res) => {});
  // PUT - 10.3. As subscriber I want to update the details of my device (name and description)
  subscriptionRouter.put("/:OPI/migration/{NPID}", (req, res) => {});

/*
//PLANS ROUTES

//POST - CREATE NEW PLAN 1.1
subscriptionRouter.post("/", (req, res) => {
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
subscriptionRouter.get("/", (req, res) => {
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
subscriptionRouter.get("/:PID", (req, res) => {
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
subscriptionRouter.put("/:PID", (req, res) => {
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

//POST - UPDATE DETAILS OF PLAN 1.3
subscriptionRouter.post("/:PID", (req, res) => {});

//DELETE - DELETE PLAN 9.2
subscriptionRouter.delete("/:PID", (req, res) => {});

//PATCH - CHANGE PRICE OF PLAN 9.3
subscriptionRouter.patch("/:PID", (req, res) => {});

//PATCH - PROMOTE PLAN 9.1
subscriptionRouter.patch("/:PID/promotion", (req, res) => {});

//GET - PRICE CHANGE HISTORY OF A PLAN 13.2
subscriptionRouter.get("/:PID/history", (req, res) => {});*/
