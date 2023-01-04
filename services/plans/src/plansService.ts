import express, { Express, Request, Response } from "express";
import { load } from "ts-dotenv";
import { planRouter } from "./routes/plansRouter";

const env = load({
  PORT: Number,
});

const app: Express = express();
const port = env.PORT || 3001;
app.use(express.json());
app.use("/plan", planRouter);

app.listen(port, () => {
  console.log(
    `⚡️[server]: Plans Service is running at http://localhost:${port}`
  );
});
