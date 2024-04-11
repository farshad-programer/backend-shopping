import winston from "winston";
import AppError from "./AppError.js";

const handleEntityParseFailed = () => {
  const message = "The JSON string sent is not valid";
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "An error occurred on the server",
    });
  }
};

const globalErrorHandler = (err, _req, res, _next) => {
  winston.error(err.message, err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV?.trim() === "development") {
    return sendErrorDev(err, res);
  } else if (process.env.NODE_ENV?.trim() === "production") {
    let error = { ...err, message: err.message };
    if (err.type === "entity.parse.failed") error = handleEntityParseFailed();
    return sendErrorProd(error, res);
  }
};

export default globalErrorHandler;
