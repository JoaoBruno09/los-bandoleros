import { Router } from "express";
import * as jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";

const current_date = new Date().valueOf().toString();
const random = Math.random().toString();
const accessTokenSecret = CryptoJS.SHA256(current_date + random).toString();
const user = { id: 1, role: "Marketing Director" };

export const router = Router();

//AUTH ROUTES
router.post("/login", (req, res) => {
  jwt.sign(user, accessTokenSecret, (err, token) => {
    res.json({
      token: token,
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
