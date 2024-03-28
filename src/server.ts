import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import _ from "lodash";

import pkg from "../package.json";
import { router as tower } from "./routers/tower";
import { router as towers } from "./routers/towers";

dotenv.config();

const PORT = process.env.PORT ?? 8000;

const app = express();

app.use(bodyParser.text());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/tower", tower);
app.use("/towers", towers);

app.get("*", (req: Request, res: Response) => {
  res.json({
    name: pkg.name,
    version: pkg.version,
    status: "ok",
  });
});

app.listen(PORT, () => {
  console.log(`API at :${PORT}`);
});
