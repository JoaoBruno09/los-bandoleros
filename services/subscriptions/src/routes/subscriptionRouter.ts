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
import { send } from "process";

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
      // console.log(user.role);
      if (user.role == "Customer") {
        //
        crypto.generateKey("hmac", { length: 40 }, (err, key) => {
          //res.json(req.body.annual);
          _axios
            .get("/plan/" + req.params.PID)
            .then((payload) => {
              // console.log(payload);
              let plan_data = payload.data;

              let end_date;
              if (req.body.annual == true) {
                end_date = moment().add(1, "year").format("YYYY-MM-DD");
              } else {
                end_date = moment().add(1, "m").format("YYYY-MM-DD");
              }
              const SID = "S" + key.export().toString("hex");
              //res.send(JSON.stringify(plan_data));
              //console.log(plan_data);
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
                plan: {
                  PID: plan_data.PID,
                  name: plan_data.name,
                  description: plan_data.description,
                  numberOfMinutes: plan_data.numberOfMinutes,
                  maximumNumberOfDevices: plan_data.maximumNumberOfDevices,
                  musicCollections: plan_data.musicCollections,
                  musicSuggestions: plan_data.musicSuggestions,
                  monthlyFee: plan_data.monthlyFee,
                  anualFee: plan_data.anualFee,
                },
                cancelled: false,
                cancelled_date: "",
              };
              //res.status(200).json(plan)

              if (db) {
                subscriptionModel.create(newSubscription).then(
                  () => {
                    //console.log(ok);
                    res.status(200).json({
                      SID: newSubscription.SID,
                      isYear: newSubscription.isYear,
                      startDate: newSubscription.isYear,
                      endDate: newSubscription.endDate,
                      user: {
                        UID: newSubscription.user.UID,
                        username: newSubscription.user.username,
                        email: newSubscription.user.email,
                      },
                      plan: {
                        PID: newSubscription.plan.PID,
                        name: newSubscription.plan.name,
                        description: newSubscription.plan.description,
                        numberOfMinutes: newSubscription.plan.numberOfMinutes,
                        maximumNumberOfDevices:
                          newSubscription.plan.maximumNumberOfDevices,
                        musicCollections: newSubscription.plan.musicCollections,
                        musicSuggestions: newSubscription.plan.musicSuggestions,
                        monthlyFee: newSubscription.plan.monthlyFee,
                        anualFee: newSubscription.plan.anualFee,
                      },
                    });
                  },
                  (erro) => {
                    res.status(500).send("Internal Server Error");
                    //res.send(erro);
                  }
                );
              } else {
                res.status(500).send("Internal Server Error");
              }
            })
            .then(async () => {
              //res.send("'E estes");
              await _axios
                .patch(
                  "/auth/" + user.UID,
                  {},
                  {
                    headers: {
                      "Content-type": "application/json",
                      Authorization: "Bearer " + token,
                    },
                  }
                )
                .then(() => {
                  //res.status(200).json("OI");
                });
            });
          /* */

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
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, accessTokenSecret, (err: any, user: any) => {
      //res.send(req.params.UID+ "-" + user.UID);
      if (user.role == "Subscriber") {
        // COLOCAR A ANTIGA COM O CANCELED A TRUE E A RESPETIVA DATA
        // CRIAR UMA NOVA SUBSCRIÇÂO
        console.log(user.UID);
        crypto.generateKey("hmac", { length: 40 }, (err, key) => {
          subscriptionModel
            .findOneAndUpdate(
              {
                "user.UID": user.UID,
                cancelled: false,
                "plan:PID": { $ne: req.params.PID },
              },
              { cancelled: true, cancelled_date: moment().format("YYYY-MM-DD") }
            )
            .then(
              () => {
                // VAI BUSCAR UM PLANO
                _axios.get("/plan/" + req.params.PID).then((payload) => {
                  let plan_data = payload.data;

                  let end_date;
                  if (req.body.annual == true) {
                    end_date = moment().add(1, "year").format("YYYY-MM-DD");
                  } else {
                    end_date = moment().add(1, "m").format("YYYY-MM-DD");
                  }

                  const SID = "S" + key.export().toString("hex");

                  console.log(plan_data);
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
                    plan: {
                      PID: plan_data.PID,
                      name: plan_data.name,
                      description: plan_data.description,
                      numberOfMinutes: plan_data.numberOfMinutes,
                      maximumNumberOfDevices: plan_data.maximumNumberOfDevices,
                      musicCollections: plan_data.musicCollections,
                      musicSuggestions: plan_data.musicSuggestions,
                      monthlyFee: plan_data.monthlyFee,
                      anualFee: plan_data.anualFee,
                    },
                    cancelled: false,
                    cancelled_date: "",
                  };
                  //res.json(newSubscription);
                  if (db) {
                    subscriptionModel.create(newSubscription).then(
                      () => {
                        //console.log(ok);
                        res.status(200).json({
                          SID: newSubscription.SID,
                          isYear: newSubscription.isYear,
                          startDate: newSubscription.startDate,
                          endDate: newSubscription.endDate,
                          user: {
                            UID: newSubscription.user.UID,
                            username: newSubscription.user.username,
                            email: newSubscription.user.email,
                          },
                          plan: {
                            PID: newSubscription.plan.PID,
                            name: newSubscription.plan.name,
                            description: newSubscription.plan.description,
                            numberOfMinutes:
                              newSubscription.plan.numberOfMinutes,
                            maximumNumberOfDevices:
                              newSubscription.plan.maximumNumberOfDevices,
                            musicCollections:
                              newSubscription.plan.musicCollections,
                            musicSuggestions:
                              newSubscription.plan.musicSuggestions,
                            monthlyFee: newSubscription.plan.monthlyFee,
                            anualFee: newSubscription.plan.anualFee,
                          },
                        });
                      },
                      (erro) => {
                        res.status(500).send("Internal Server Error");
                      }
                    );
                  } else {
                    res.status(500).send("Internal Server Error");
                  }
                });
              },
              (erro) => {
                res.status(404).send("Not Found");
              }
            );
        });
      } else {
        // QUANDO NÃO É UM SBSCRIBER
        res.status(400).send("Bad Request");
      }
    });
  } else {
    // QUANDO NÃO TEM UM TOKEN DE AUTORIZAÇÃO
    res.status(401).send("Access token is missing or invalid");
  }
});

// DELETE - 2.2. As subscriber I want to cancel my subscription
subscriptionRouter.delete("/:UID", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, accessTokenSecret, (err: any, user: any) => {
      //res.send(req.params.UID+ "-" + user.UID);
      if (user.UID === req.params.UID && user.role == "Subscriber") {
        // COLOCAR A ANTIGA COM O CANCELED A TRUE E A RESPETIVA DATA
        // CRIAR UMA NOVA SUBSCRIÇÂO
        //console.log(user.UID);
        crypto.generateKey("hmac", { length: 40 }, (err, key) => {
          subscriptionModel
            .findOneAndUpdate(
              {
                "user.UID": user.UID,
                cancelled: false,
              },
              { cancelled: true, cancelled_date: moment().format("YYYY-MM-DD") }
            )
            .then(
              (update_data) => {
                _axios
                  .patch(
                    "/auth/" + user.UID,
                    {},
                    {
                      headers: {
                        "Content-type": "application/json",
                        Authorization: "Bearer " + token,
                      },
                    }
                  )
                  .then(
                    () => {
                      res.status(200).send("OK");
                    },
                    (erro) => {
                      subscriptionModel.findOneAndUpdate(
                        { SID: update_data?.SID },
                        { cancelled: false, cancelled_date: "" }
                      );
                      res.status(500).send("Internal Server Error");
                    }
                  );
              },
              (erro) => {
                res.status(500).send("Internal Server Error");
              }
            );
        });
      } else {
        res.send(404).send("Not Found");
      }
    });
  } else {
    res.status(401).send("Unauthorized. Access token is missing!");
  }
});

// GET - 2.3. As subscriber I want to know the details of my plan
subscriptionRouter.get("/:UID", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, accessTokenSecret, (err: any, user: any) => {
      //res.send(req.params.UID+ "-" + user.UID);
      if (user.UID === req.params.UID && user.role == "Subscriber") {
        if (db) {
          subscriptionModel
            .findOne(
              { "user.UID": req.params.UID, cancelled: false },
              { _id: 0, cancelled: 0, user: 0, cancelled_date: 0, __v: 0 }
            )
            .then(
              (plan) => {
                if (plan) {
                  res.status(200).json(plan);
                } else {
                  res.status(404).send("Not Found");
                  //res.status(404).json("Not found. Plan not found or doesn't exist!");
                }
              },
              (erro) => {
                res.status(500).send("Internal Server Error");
              }
            );
        } else {
          res.status(500).send("Internal Server Error");
        }
      } else {
        res.status(404).send("Not Found");
      }
    });
  } else {
    res.status(401).send("Unauthorized. Access token is missing!");
  }

  // VALIDAR
});

// PUT - 10.2. As subscriber I want to renew my annual subscription
// VERIFICAR COMPORTAMENTOS / FALAR COM A MALTA
subscriptionRouter.put("/:UID", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, accessTokenSecret, (err: any, user: any) => {
      //res.send(req.params.UID+ "-" + user.UID);
      if (user.UID === req.params.UID && user.role == "Subscriber") {
        if (db) {
          subscriptionModel.findOneAndUpdate({
            "user.UID": req.params.UID,
            cancelled: false,
          });
        } else {
          res.status(500).send("Internal Server Error");
        }
      } else {
      }
    });
  } else {
    res.status(401).send("Access token is missing or invalid");
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
subscriptionRouter.delete("/:UID/devices/:DID", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, accessTokenSecret, (err: any, user: any) => {
      if (user.UID === req.params.UID && user.role == "Subscriber") {
        if (db) {
          devicesModel
            .findOneAndDelete({ UID: user.UID, DID: req.params.DID })
            .then(
              (device) => {
                if (device) {
                  res.status(200).send("Ok");
                } else {
                  res.status(404).send("Not Found");
                }
              },
              (erro) => {
                res.status(500).send("Internal Server Error");
              }
            );
        } else {
          res.status(500).send("Internal Server Error");
        }
      } else {
        res.status(404).send("Not Found"); // ?????? SERÀ O 401
      }
    });
  } else {
    res.status(401).send("Access token is missing or invalid");
  }
});
// PUT - 5.3. As subscriber I want to update the details of my device (name and description)
subscriptionRouter.put("/:UID/devices/:DID", (req, res) => {
  // FALTA VERIFICAR SE OS DADOS DO
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, accessTokenSecret, (err: any, user: any) => {
      if (user.UID === req.params.UID && user.role == "Subscriber") {
        if (db) {
          devicesModel
            .findOneAndUpdate(
              { DID: req.params.DID, UID: req.params.UID },
              { device: req.body.device, esn: req.body.esn }
            )
            .then(
              (device) => {
                //res.send(device);
                if (device) {
                  res.status(200).send({
                    DID: device.DID,
                    device: device.device,
                    esn: device.esn,
                    affiliatedOn: device.affiliatedOn,
                  });
                } else {
                  res.status(500).send("Internal Server Error");
                }
              },
              (erro) => {
                res.status(404).send("Not Found");
              }
            );
        } else {
          res.status(500).send("Internal Server Error");
        }
      } else {
        res.status(401).send("Access token is missing or invalid");
      }
    });
  } else {
    res.status(401).send("Access token is missing or invalid");
  }
});
// PUT - 10.3. As marketing director, I want to migrate all subscribers of a certain plan to a different plan
subscriptionRouter.put("/:OPID/migration/:NPID", (req, res) => {
  //res.send("OK");
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, accessTokenSecret, (err: any, user: any) => {
      //res.send(req.params.UID+ "-" + user.UID);
      if (user.role == "Marketing Director") {
        _axios.get("/plan/" + req.params.NPID).then((payload) => {
          console.log(payload.data);

          if (db) {
            subscriptionModel
              .updateMany(
                { "plan.PID": req.params.OPID },
                {
                  "plan.PID": payload.data.PID,
                  "plan.name": payload.data.name,
                  "plan.description": payload.data.description,
                  "plan.numberOfMinutes": payload.data.numberOfMinutes,
                  "plan.maximumNumberOfUsersDevices":
                    payload.data.aximumNumberOfUsersDevices,
                  "plan.musicCollections": payload.data.musicCollections,
                  "plan.musicSuggestions": payload.data.musicSuggestions,
                  "plan.monthlyFee": payload.data.monthlyFee,
                  "plan.anualFee": payload.data.anualFee,
                }
              )
              .then(
                () => {
                  res.status(200).send("Ok");
                },
                (erro) => {
                  res.status(404).send("Not Found");
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
