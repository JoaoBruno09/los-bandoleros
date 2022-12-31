import express, { Express, Request, Response } from "express";
import { load } from "ts-dotenv";
import { authRouter } from "./routes/authRouter";

const env = load({
  PORT: Number,
});

const app: Express = express();
const port = env.PORT || 3002;
app.use(express.json());
app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(
    `⚡️[server]: Auth Service is running at http://localhost:${port}`
  );
});
