import express, { Express, Request, Response } from "express";
import { router as routerPlans } from "./src/routes/Plans";

const app: Express = express();
const port = process.env.PORT || 3000;

//ROUTES
app.use("/plans", routerPlans);

app.use("/", (req: Request, res: Response) => {
  res.status(404).send("404 NOT FOUND");
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
