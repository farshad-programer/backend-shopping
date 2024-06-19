import winston from "winston";
import { format } from "date-fns";
import { v4 as uuid } from "uuid";
export default function () {
  const customFormat = winston.format.combine(
    winston.format.printf((info) => {
      const { level, message, stack, timestamp } = info;
      // Extract the first line of the stack trace containing the error location
      const errorLine = stack.split("\n")[1];
      const errorMessage = stack.split("\n")[0];
      const dateTime = format(new Date(), "yyyyMMdd\tHH:mm:ss");

      return `${errorMessage}\t${errorLine}\t${dateTime}\t${uuid()}\n${stack}`;
    })
  );

  winston.add(
    new winston.transports.File({
      filename: "logfile.log",
      format: customFormat,
    })
  );

  process.on("uncaughtException", (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
  });

  process.on("unhandledRejection", (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
  });
}
