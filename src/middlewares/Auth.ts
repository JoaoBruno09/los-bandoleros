import { Router } from "express";
import crypto from "crypto";
import * as jwt from "jsonwebtoken";

let accessTokenSecret: string;
crypto.generateKey("hmac", { length: 100 }, (err, key) => {
  if (err) throw err;
  accessTokenSecret = key.export().toString("hex");
});
const user = { id: 1, role: "Marketing Director" };

export const authRouter = Router();

//AUTH ROUTES
authRouter.post("/login", (req, res) => {
  jwt.sign(user, accessTokenSecret, (err, token) => {
    res.json({
      token: token,
      accessTokenSecret: accessTokenSecret,
    });
  });
});

//CHECK HEADER AUTHORIZATION WITH JWT
export const authenticateJWT = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, accessTokenSecret, (err: any, user: any) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
