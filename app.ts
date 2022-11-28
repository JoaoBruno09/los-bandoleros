import express, { Express, Request, Response } from "express";
import { router as routerPlan } from "./src/routes/Plans";
import { router as routerAuth } from "./src/middlewares/Auth";

const app: Express = express();
const port = process.env.PORT || 3000;

//APP ROUTES
app.use("/auth", routerAuth);
app.use("/plan", routerPlan);

app.use("/", (req: Request, res: Response) => {
  res.status(404).send("404 NOT FOUND");
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
