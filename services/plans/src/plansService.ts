import express, { Express } from "express";
import { load } from "ts-dotenv";
import { planRouter } from "./routes/plansRouter";

const env = load({
  PORT: Number,
  BASE_URL: String,
});

const app: Express = express();
const port = env.PORT || 3001;
app.use(
  express.json({
    type: ["application/json", "application/vnd.los-bandoleros.hyper+json"],
  })
);
app.use("/plan", planRouter);

app.listen(port, () => {
  console.log(
    `⚡️[server]: Plans Service is running at http://localhost:${port}`
  );
});
