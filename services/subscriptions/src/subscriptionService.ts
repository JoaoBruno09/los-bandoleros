import express, { Express, Request, Response } from "express";
import { load } from "ts-dotenv";
//import { db } from "./src/config/DatabaseConfig";
import { subscriptionRouter } from "./routes/subscriptionRouter";

const env = load({
  PORT: Number,
});

const app: Express = express();
const port = env.PORT || 3003;

app.use(express.json());
app.use("/subscription", subscriptionRouter, (req, res) => {
  console.log(req.body);
});

//app.use("/auth", authRouter);
app.listen(port, () => {
  console.log(
    `⚡️[server]: Subscriptions Service is running at http://localhost:${port}`
  );
  //db.on("error", (error) => console.log(error));
  //db.once("open", () => console.log("Conected to Database"));
});
