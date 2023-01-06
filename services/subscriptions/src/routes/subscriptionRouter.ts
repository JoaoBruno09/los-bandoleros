import e, { response, Router } from "express";
import {
  subscriptionModel,
  Subscription,
  devicesModel,
  Device,
  musicSuggestionsEnum,
} from "../models/subscriptionModel";
/*import { devicesModel, Device } from "../models/devicesModel";*/
import crypto from "crypto";
import { db } from "../config/DatabaseConfig";
import * as jwt from "jsonwebtoken";
import moment from "moment";
import axios from "axios";

const _axios = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-type": "application/json",
  },
});

console.log("----------------------------------------something");
const accessTokenSecret: string = "the-secret-key";
export const subscriptionRouter = Router();

// POST - 2.1. As a new customer I want to subscribe to a plan
subscriptionRouter.post("/plan/:PID", (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, accessTokenSecret, (err: any, user: any) => {
      //res.json("ENTROU");
      if (user.role == "Customer") {
        crypto.generateKey("hmac", { length: 40 }, (err, key) => {
          let end_date;
          if (req.body.annual == true) {
            end_date = moment().add(1, "year").format("YYYY-MM-DD");
          } else {
            end_date = moment().add(1, "d").format("YYYY-MM-DD");
          }
          const SID = "S" + key.export().toString("hex");
          //res.json(req.body.annual);
          const newSubscription: Subscription = {
            SID: SID,
            isYear: req.body.annual,
            startDate: moment().format("YYYY-MM-DD"),
            endDate: end_date,
            user: {
              UID: user.UID,
              username: user.username,
              email: user.email,
            },
          };

          _axios
            .get("/plan/", {
              params: {
                PID: req.params.PID,
              },
            })
            .then((plan) => {
              //res.status(200).json(plan)
              if (db) {
                subscriptionModel.create(newSubscription).then(
                  () => {
                    res.send("Criou");
                    // UPDATE USER ROLE
                    // --- TERMINAR ---
                    /*_axios.patch("/auth/:UID", {
                      params: {
                        UID: user.UID,
                      },
                      headers: {
                        "Content-type": "application/json",
                        "Authorization": "Bearer " + token,
                      },
                    })   .then((resp)=>{
                      res.send(resp);
                    }) */
                    //res.status(200).json(newSubscription);
                  }
                  /*  (erro) => {
                    res.status(500).send("Internal Server Error");
                  } */
                );
              } else {
                res.status(500).send("Internal Server Error");
              }
            });

          //RESPONSE ERRO DO FAILED DO GET
        });
      } else {
        res.status(401).json("Access token is missing or invalid");
      }
    });
  } else {
    res.status(401).send("Unauthorized. Access token is missing!");
  }
});

// PUT - 10.1. As subscriber I want to switch my plan (upgrade/downgrade)
subscriptionRouter.put("/plan/:PID", (req, res) => {
  if (db) {
  } else {
  }
});

// DELETE - 2.2. As subscriber I want to cancel my subscription
subscriptionRouter.delete("/:UID", (req, res) => {
  if (db) {
  } else {
  }
});

// GET - 2.3. As subscriber I want to know the details of my plan
subscriptionRouter.get("/:UID", (req, res) => {
  // VALIDAR
  if (db) {
    subscriptionModel.find({ user: { UID: req.params.UID } }).then((sub) => {
      if (sub.length > 0) {
        res.status(200).json(sub);
      } else {
        res.status(404);
        //res.status(404).json("Not found. Plan not found or doesn't exist!");
      }
    });
  } else {
  }
});

// PUT - 10.2. As subscriber I want to renew my annual subscription
subscriptionRouter.put("/:UID", (req, res) => {
  if (db) {
  } else {
  }
});

// POST - 5.1 As subscriber I want to add a new device to my subscription
subscriptionRouter.post("/:UID/devices", (req, res) => {
  // FALTA VALIDAR A QUANDTIDADE DE DEVICES QUE UM USER PODE INSERIR
  //res.send(req.params.UID);
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, accessTokenSecret, (err: any, user: any) => {
      //res.send(req.params.UID+ "-" + user.UID);
      if (user.UID === req.params.UID && user.role == "Subscriber") {
        //ADICIONA O DEVICE
        //res.send(req.body);
        crypto.generateKey("hmac", { length: 40 }, (err, key) => {
          const DID = "D" + key.export().toString("hex");
          const newDevice: Device = {
            DID: DID,
            device: req.body.device,
            esn: req.body.esn,
            affiliatedOn: moment().format("YYYY-MM-DD"),
            UID: user.UID,
          };
          if (db) {
            devicesModel.create(newDevice).then(
              () => {
                res.status(201).json({
                  DID: newDevice.DID,
                  device: newDevice.device,
                  esn: newDevice.esn,
                  affiliatedOn: newDevice.affiliatedOn,
                  UID: newDevice.UID,
                });
              },
              (erro) => {
                //res.send(erro);
                res.status(500).send("Internal Server Error");
              }
            );
          } else {
            res.status(500).send("Internal Server Error");
          }
        });
      } else {
        res.status(404).send("Not Found");
      }
    });
  } else {
    res.status(401).send("Access token is missing or invalid");
  }
});

// GET - 5.4 As subscriber I want to list my devices
subscriptionRouter.get("/:UID/devices", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, accessTokenSecret, (err: any, user: any) => {
      //res.send(req.params.UID+ "-" + user.UID);
      if (user.UID === req.params.UID && user.role == "Subscriber") {
        //res.send("ENTROU");
        if (db) {
          devicesModel.find({ UID: user.UID }, { _id: 0, __v: 0 }).then(
            (devices) => {
              res.status(200).json(devices);
            },
            (erro) => {
              res.status(500).json("Internal Server Error");
            }
          );
        } else {
          res.status(500).json("Internal Server Error");
        }
      } else {
        res.status(400).json("Bad Request");
      }
    });
  } else {
    res.status(401).send("Access token is missing or invalid");
  }
});
// DELETE - 5.2. As subscriber I want to remove a device from my subscription
subscriptionRouter.delete("/:UID/devices/{DID}", (req, res) => {
  if (db) {
  } else {
  }
});
// PUT - 5.3. As subscriber I want to update the details of my device (name and description)
subscriptionRouter.put("/:UID/devices/{DID}", (req, res) => {
  if (db) {
  } else {
  }
});
// PUT - 10.3. As subscriber I want to update the details of my device (name and description)
subscriptionRouter.put("/:OPI/migration/{NPID}", (req, res) => {
  if (db) {
  } else {
  }
});
