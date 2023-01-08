import express, { Express } from "express";
import { load } from "ts-dotenv";
import { subscriptionRouter } from "./routes/subscriptionRouter";

const env = load({
  PORT: Number,
  BASE_URL: String,
});

const app: Express = express();
const port = env.PORT || 3003;

app.use(
  express.json({
    type: ["application/json", "application/vnd.los-bandoleros.hyper+json"],
  })
);
app.use("/subscription", subscriptionRouter);

//app.use("/auth", authRouter);
app.listen(port, () => {
  console.log(
    `⚡️[server]: Subscriptions Service is running at http://localhost:${port}`
  );
  //db.on("error", (error) => console.log(error));
  //db.once("open", () => console.log("Conected to Database"));
});
