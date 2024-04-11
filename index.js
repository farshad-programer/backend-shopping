import "express-async-errors";
import { uncaughtException } from "./src/ErrorControls/errorExeption.js";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import logging from "./startup/logging.js";
logging();
import cookieParser from "cookie-parser";
import AppError from "./src/ErrorControls/AppError.js";
import credentials from "./src/middlewares/credential.js";
import configApp from "./startup/config.js";
import db from "./startup/db.js";

import router from "./src/routes/index.js";
import cors from "cors";
import globalErrorHandler from "./src/ErrorControls/errorController.js";
app.use(express.static("public/uploads"));
configApp(app, express, cookieParser, cors, credentials);
db();
app.use("/api", router);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);
import { unhandledRejection } from "./src/ErrorControls/errorExeption.js";
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening on port ${port}`));
