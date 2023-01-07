import { Router } from "express";
import { planModel, Plan, musicSuggestionsEnum } from "../models/plansModel";
import crypto from "crypto";
import { db } from "../config/DatabaseConfig";
import * as jwt from "jsonwebtoken";
import { load } from "ts-dotenv";

const accessTokenSecret: string = "the-secret-key";
export const planRouter = Router();
const env = load({
  BASE_URL: String,
});

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
            maximumNumberOfUsersDevices: req.body.maximumNumberOfUsersDevices,
            numberOfMinutes: req.body.numberOfMinutes,
            musicCollections: req.body.musicCollections,
            musicSuggestions: req.body.musicSuggestions,
            monthlyFee: req.body.monthlyFee,
            annualFee: req.body.annualFee,
          };

          if (
            newPlan.musicSuggestions === musicSuggestionsEnum.automatic ||
            newPlan.musicSuggestions === musicSuggestionsEnum.personalized
          ) {
            if (db) {
              planModel.create(newPlan).then(
                () => {
                  planModel
                    .findOne(
                      { PID: newPlan.PID },
                      { _id: 0, __v: 0, priceHistory: 0 }
                    )
                    .then((plan) => {
                      if (plan !== null) {
                        if (isHyperMedia(req.headers["content-type"])) {
                          const linksHypermedia = [
                            {
                              rel: "collection",
                              href: env.BASE_URL + "/plan",
                            },
                            {
                              rel: "item",
                              href: env.BASE_URL + "/plan/" + newPlan.PID,
                            },
                            {
                              rel: "edit",
                              href: env.BASE_URL + "/plan/" + newPlan.PID,
                            },
                            {
                              rel: "collection",
                              href:
                                env.BASE_URL +
                                "/plan/" +
                                newPlan.PID +
                                "/history",
                            },
                            {
                              rel: "edit",
                              href:
                                env.BASE_URL +
                                "/plan/" +
                                newPlan.PID +
                                "/promotion",
                            },
                            {
                              rel: "subscribe",
                              href:
                                env.BASE_URL +
                                "/subscription/plan/" +
                                newPlan.PID,
                            },
                          ];
                          res
                            .status(200)
                            .json({ plan: plan, links: linksHypermedia });
                        } else {
                          res.status(200).json(plan);
                        }
                      } else {
                        res.status(400).send("Bad Request");
                      }
                    });
                },
                (error) => {
                  res.status(400).send("Bad Request");
                }
              );
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

//GET - GET ALL PLANS 1. CORRIGIR
planRouter.get("/", (req, res) => {
  if (db) {
    planModel
      .find({ isActive: true }, { _id: 0, __v: 0, priceHistory: 0 })
      .then(
        (plansDB) => {
          if (plansDB.length > 0) {
            if (isHyperMedia(req.headers["content-type"])) {
              const plans: any = [];
              plansDB.map((plan) => {
                const planHyperMedia: any = [];
                planHyperMedia.push(plan);
                const linkHypermedia = {
                  rel: "item",
                  href: env.BASE_URL + "/plan/" + plan.PID,
                };
                planHyperMedia.push(linkHypermedia);
                plans.push(planHyperMedia);
              });
              res.status(200).json({ plans });
            } else {
              res.status(200).json({
                plans: plansDB,
              });
            }
          } else {
            res.status(404).json("Not found. Plans not found or don't exist!");
          }
        },
        (error) => {
          res.status(500).send("Internal Server Error");
        }
      );
  } else {
    res.status(500).send();
  }
});

//GET - GET PLAN
planRouter.get("/:PID", (req, res) => {
  if (db) {
    planModel
      .findOne(
        { PID: req.params.PID, isActive: true },
        { _id: 0, __v: 0, priceHistory: 0 }
      )
      .then(
        (plan) => {
          if (plan !== null) {
            if (isHyperMedia(req.headers["content-type"])) {
              const linksHypermedia = [
                {
                  rel: "collection",
                  href: env.BASE_URL + "/plan",
                },
                {
                  rel: "item",
                  href: env.BASE_URL + "/plan/" + req.params.PID,
                },
                {
                  rel: "edit",
                  href: env.BASE_URL + "/plan/" + req.params.PID,
                },
                {
                  rel: "collection",
                  href: env.BASE_URL + "/plan/" + req.params.PID + "/history",
                },
                {
                  rel: "edit",
                  href: env.BASE_URL + "/plan/" + req.params.PID + "/promotion",
                },
                {
                  rel: "subscribe",
                  href: env.BASE_URL + "/subscription/plan/" + req.params.PID,
                },
              ];
              res.status(200).json({ plan: plan, links: linksHypermedia });
            } else {
              res.status(200).json(plan);
            }
          } else {
            res.status(404).json("Not found. Plan not found or doesn't exist!");
          }
        },
        (error) => {
          res.status(500).send("Internal Server Error");
        }
      );
  } else {
    res.status(500).send("Internal Server Error");
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
            .then(
              (response) => {
                if (response !== null) {
                  planModel
                    .findOne(
                      { PID: req.params.PID },
                      { _id: 0, __v: 0, priceHistory: 0 }
                    )
                    .then((plan) => {
                      if (plan !== null) {
                        if (isHyperMedia(req.headers["content-type"])) {
                          const linksHypermedia = [
                            {
                              rel: "collection",
                              href: env.BASE_URL + "/plan",
                            },
                            {
                              rel: "item",
                              href: env.BASE_URL + "/plan/" + req.params.PID,
                            },
                            {
                              rel: "edit",
                              href: env.BASE_URL + "/plan/" + req.params.PID,
                            },
                            {
                              rel: "collection",
                              href:
                                env.BASE_URL +
                                "/plan/" +
                                req.params.PID +
                                "/history",
                            },
                            {
                              rel: "edit",
                              href:
                                env.BASE_URL +
                                "/plan/" +
                                req.params.PID +
                                "/promotion",
                            },
                            {
                              rel: "subscribe",
                              href:
                                env.BASE_URL +
                                "/subscription/plan/" +
                                req.params.PID,
                            },
                          ];
                          res.status(200).json({ links: linksHypermedia });
                        } else {
                          res.status(200).json("OK");
                        }
                      } else {
                        res.status(400).send("Bad Request");
                      }
                    });
                } else {
                  res
                    .status(404)
                    .json("Not found. Plan not found or doesn't exist!");
                }
              },
              (error) => {
                res.status(400).send("Bad Request");
              }
            );
        } else {
          res.status(500).send("Internal Server Error");
        }
      }
    });
  } else {
    res.status(401).send("Unauthorized. Access token is missing!");
  }
});

//POST - UPDATE DETAILS OF PLAN 1.3
planRouter.post("/:PID", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, accessTokenSecret, (err: any, user: any) => {
      if (user.role !== "Marketing Director") {
        res
          .status(401)
          .send("Unauthorized. You don't have access to this resource!");
      } else {
        const updatePlan = {
          name: req.body?.name,
          description: req.body?.description,
          maximumNumberOfDevices: req.body?.maximumNumberOfDevices,
          numberOfMinutes: req.body?.numberOfMinutes,
          musicCollections: req.body?.musicCollections,
          musicSuggestions: req.body?.musicSuggestions,
        };

        if (
          updatePlan?.musicSuggestions === undefined ||
          updatePlan?.musicSuggestions === musicSuggestionsEnum.automatic ||
          updatePlan?.musicSuggestions === musicSuggestionsEnum.personalized
        ) {
          if (db) {
            planModel
              .findOneAndUpdate({ PID: req.params.PID }, updatePlan)
              .then(
                (response) => {
                  if (response !== null) {
                    planModel
                      .findOne(
                        { PID: req.params.PID },
                        { _id: 0, __v: 0, priceHistory: 0 }
                      )
                      .then((plan) => {
                        if (plan !== null) {
                          if (isHyperMedia(req.headers["content-type"])) {
                            const linksHypermedia = [
                              {
                                rel: "collection",
                                href: env.BASE_URL + "/plan",
                              },
                              {
                                rel: "item",
                                href: env.BASE_URL + "/plan/" + req.params.PID,
                              },
                              {
                                rel: "edit",
                                href: env.BASE_URL + "/plan/" + req.params.PID,
                              },
                              {
                                rel: "collection",
                                href:
                                  env.BASE_URL +
                                  "/plan/" +
                                  req.params.PID +
                                  "/history",
                              },
                              {
                                rel: "edit",
                                href:
                                  env.BASE_URL +
                                  "/plan/" +
                                  req.params.PID +
                                  "/promotion",
                              },
                              {
                                rel: "subscribe",
                                href:
                                  env.BASE_URL +
                                  "/subscription/plan/" +
                                  req.params.PID,
                              },
                            ];
                            res
                              .status(200)
                              .json({ plan: plan, links: linksHypermedia });
                          } else {
                            res.status(200).json(plan);
                          }
                        } else {
                          res.status(400).send("Bad Request");
                        }
                      });
                  } else {
                    res
                      .status(404)
                      .json("Not found. Plan not found or doesn't exist!");
                  }
                },
                (error) => {
                  res.status(400).send("Bad Request");
                }
              );
          } else {
            res.status(500).send("Internal Server Error");
          }
        } else {
          res.status(400).send("Bad Request");
        }
      }
    });
  } else {
    res.status(401).send("Unauthorized. Access token is missing!");
  }
});

//DELETE - DELETE PLAN 9.2
planRouter.delete("/:PID", (req, res) => {
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
          planModel.findOneAndDelete({ PID: req.params.PID }).then(
            (plan) => {
              if (plan !== null) {
                if (isHyperMedia(req.headers["content-type"])) {
                  const linksHypermedia = [
                    {
                      rel: "collection",
                      href: env.BASE_URL + "/plan",
                    },
                    {
                      rel: "edit",
                      href: env.BASE_URL + "/plan/" + req.params.PID,
                    },
                    {
                      rel: "collection",
                      href:
                        env.BASE_URL + "/plan/" + req.params.PID + "/history",
                    },
                    {
                      rel: "edit",
                      href:
                        env.BASE_URL + "/plan/" + req.params.PID + "/promotion",
                    },
                    {
                      rel: "subscribe",
                      href:
                        env.BASE_URL + "/subscription/plan/" + req.params.PID,
                    },
                  ];
                  res.status(200).json({ links: linksHypermedia });
                } else {
                  res.status(200).json("OK");
                }
              } else {
                res
                  .status(404)
                  .json("Not found. Plan not found or doesn't exist!");
              }
            },
            (error) => {
              res.status(500).send("Internal Server Error");
            }
          );
        } else {
          res.status(500).send("Internal Server Error");
        }
      }
    });
  } else {
    res.status(401).send("Unauthorized. Access token is missing!");
  }
});

//PATCH - CHANGE PRICE OF PLAN 9.3
planRouter.patch("/:PID", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, accessTokenSecret, (err: any, user: any) => {
      if (user.role !== "Marketing Director") {
        res
          .status(401)
          .send("Unauthorized. You don't have access to this resource!");
      } else {
        const monthlyFeeIncom: number = req.body.monthlyFee;
        const annualFeeIncom: number = req.body.annualFee;
        if (db) {
          planModel.findOne({ PID: req.params.PID }).then((plan) => {
            if (plan !== null) {
              const dateChangedPrice = new Date();
              const priceForHistory = {
                oldMonthlylFee: plan.monthlyFee,
                newMonthlylFee: monthlyFeeIncom,
                oldAnnualFee: plan.annualFee,
                newAnnualFee: annualFeeIncom,
                changedDate: dateChangedPrice,
              };
              planModel
                .findOneAndUpdate(
                  { PID: req.params.PID },
                  {
                    monthlyFee: monthlyFeeIncom,
                    annualFee: annualFeeIncom,
                    $push: { priceHistory: priceForHistory },
                  }
                )
                .then(
                  (response) => {
                    if (response !== null) {
                      planModel
                        .find(
                          { PID: req.params.PID },
                          { _id: 0, __v: 0, priceHistory: 0 }
                        )
                        .then((plan) => {
                          if (plan !== null) {
                            if (isHyperMedia(req.headers["content-type"])) {
                              const linksHypermedia = {
                                rel: "prev",
                                href: env.BASE_URL + "/plan/" + req.params.PID,
                              };
                              res
                                .status(200)
                                .json({ plan: plan, links: linksHypermedia });
                            } else {
                              res.status(200).json(plan);
                            }
                          } else {
                            res.status(400).send("Bad Request");
                          }
                        });
                    } else {
                      res
                        .status(404)
                        .json("Not found. Plan not found or doesn't exist!");
                    }
                  },
                  (error) => {
                    res.status(400).send("Bad Request");
                  }
                );
            } else {
              res.status(500).send("Internal Server Error");
            }
          });
        } else {
          res.status(500).send("Internal Server Error");
        }
      }
    });
  } else {
    res.status(401).send("Unauthorized. Access token is missing!");
  }
});

//PATCH - PROMOTE PLAN 9.1
planRouter.patch("/:PID/promotion", (req, res) => {
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
            .findOneAndUpdate({ PID: req.params.PID }, { isPromoted: true })
            .then(
              (response) => {
                if (response !== null) {
                  planModel
                    .find(
                      { PID: req.params.PID },
                      { _id: 0, __v: 0, priceHistory: 0 }
                    )
                    .then((plan) => {
                      if (plan !== null) {
                        if (isHyperMedia(req.headers["content-type"])) {
                          const linksHypermedia = {
                            rel: "prev",
                            href: env.BASE_URL + "/plan/" + req.params.PID,
                          };
                          res
                            .status(200)
                            .json({ plan: plan, links: linksHypermedia });
                        } else {
                          res.status(200).json(plan);
                        }
                      } else {
                        res.status(400).send("Bad Request");
                      }
                    });
                } else {
                  res
                    .status(404)
                    .json("Not found. Plan not found or doesn't exist!");
                }
              },
              (error) => {
                res.status(500).send("Internal Server Error");
              }
            );
        } else {
          res.status(500).send("Internal Server Error");
        }
      }
    });
  } else {
    res.status(401).send("Unauthorized. Access token is missing!");
  }
});

//GET - PRICE CHANGE HISTORY OF A PLAN 13.2
planRouter.get("/:PID/history", (req, res) => {
  if (db) {
    planModel
      .find(
        { PID: req.params.PID },
        {
          _id: 0,
          __v: 0,
          name: 0,
          description: 0,
          numberOfMinutes: 0,
          maximumNumberOfUsersDevices: 0,
          musicCollections: 0,
          musicSuggestions: 0,
          monthlyFee: 0,
          annualFee: 0,
          isPromoted: 0,
          isActive: 0,
        }
      )
      .then(
        (plan) => {
          if (plan !== null) {
            if (isHyperMedia(req.headers["content-type"])) {
              const linksHypermedia = {
                rel: "prev",
                href: env.BASE_URL + "/plan/" + req.params.PID,
              };
              res.status(200).json({ plan: plan, links: linksHypermedia });
            } else {
              res.status(200).json(plan);
            }
          } else {
            res.status(404).json("Not found. Plan not found or doesn't exist!");
          }
        },
        (error) => {
          res.status(500).send("Internal Server Error");
        }
      );
  } else {
    res.status(500).send("Internal Server Error");
  }
});

function isHyperMedia(reqHeaders: any) {
  if (reqHeaders === "application/json") return false;
  if (reqHeaders === "application/vnd.los-bandoleros.hyper+json") return true;
}
