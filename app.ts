import express, { Express, Request, Response } from "express";
import { db } from "./src/config/DatabaseConfig";
import { planRouter } from "./src/routes/Plan";
import { authRouter } from "./src/middlewares/Auth";

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(express.json());

//APP ROUTES
app.use("/auth", authRouter);
app.use("/plan", planRouter);

app.use("/", (req: Request, res: Response) => {
  res.sendStatus(404);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
  db.on("error", (error) => console.log(error));
  db.once("open", () => console.log("Conected to Database"));
});
