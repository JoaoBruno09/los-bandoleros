import express, { Express, Request, Response } from "express";
import * as dotenv from "dotenv";
//import { db } from "./src/config/DatabaseConfig";
import { planRouter } from "./routes/plansRouter";
import { authRouter } from "./middlewares/Auth";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3001;
app.use(express.json());
app.use("/plan", planRouter);

//app.use("/auth", authRouter);
app.listen(port, () => {
  console.log(
    `⚡️[server]: Plans Service is running at http://localhost:${port}`
  );
  //db.on("error", (error) => console.log(error));
  //db.once("open", () => console.log("Conected to Database"));
});
