import winston from "winston";

export const uncaughtException = process.on("uncaughtException", (err) => {
  winston.error(err.message, err);

  console.log(
    "UNCAUGHT EXCEPTION! 💥💥🚀 Shutting down ...",
    err.stack.split("\n")[1]
  );
  process.exit(1);
});

export const unhandledRejection = process.on("unhandledRejection", (err) => {
  winston.error(err.message, err);

  console.log(
    "UNHANDLED REJECTION! 💥💥 shutting down...",
    err.stack.split("\n")[1]
  );

  server.close(() => {
    process.exit(1);
  });
});
