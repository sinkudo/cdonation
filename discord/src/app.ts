import express from "express";
import * as bodyParser from "body-parser";
import ApiRouter from "@/routes/api.route";

export const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "5mb" }));

app.use("/", ApiRouter);