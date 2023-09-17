import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import debug from "debug";
debug("app:main");
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import config from "config";
import winston from "winston";
import AppError from "./src/ErrorControls/AppError.js";
import credentials from "./src/middlewares/credential.js";
import configApp from "./startup/config.js";
logging();

import db from "./startup/db.js";
import logging from "./startup/logging.js";
import router from "./src/routes/index.js";
import cors from "cors";
import globalErrorHandler from "./src/ErrorControls/errorController.js";
import fileUpload from "express-fileupload";

configApp(app, express, cookieParser, cors, credentials,fileUpload);
db();
app.use("/api", router);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening on port ${port}`));
