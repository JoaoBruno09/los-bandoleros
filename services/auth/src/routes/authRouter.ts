import { Router } from "express";
import crypto from "crypto";
import * as jwt from "jsonwebtoken";
import { db } from "../config/DatabaseConfig";
import { authModel } from "../models/authModel";
import multer from "multer";

const accessTokenSecret: string = "the-secret-key";
export const authRouter = Router();

//AUTH ROUTE
//uses multer module to get the multipart/form-data
authRouter.post("/login", multer().none(), (req, res) => {
  if (db) {
    //get password encripted to combine with the one is in bd
    const passwordEncripted = crypto
      .createHash("md5")
      .update(req.body.password)
      .digest("hex");

    authModel
      .findOne(
        { username: req.body.username, password: passwordEncripted },
        { _id: 0 }
      )
      .then(
        (user) => {
          if (user !== null) {
            jwt.sign(JSON.stringify(user), accessTokenSecret, (err, token) => {
              res.status(200).json({
                token: token,
              });
            });
          } else {
            res.status(404).send("Not Found. User doesn't exist");
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
