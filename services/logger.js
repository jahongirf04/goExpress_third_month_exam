const config = require("config");
const { json } = require("express");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf, prettyPrint, colorize } = format;

const myFormat = prettyPrint(({message,timestamp }) => {
  return `${timestamp} ${message}`;
});
var logger;
if (process.env.NODE_ENV == "development") {
  logger = createLogger({
    format: combine(colorize(), timestamp(), myFormat),
    transports: [
      new transports.File({ filename: "log/database.log", level: "info" }),
    ],
  });
} else {
  logger = createLogger({
    format: combine(colorize(), timestamp(), myFormat),
    transports: [
      new transports.File({ filename: "log/database.log", level: "info" }),
    ],
  });
}
logger.exceptions.handle(
  new transports.File({ filename: "log/exeptions.log" })
);
logger.rejections.handle(
  new transports.File({ filename: "log/rejections.log" })
);
logger.exitOnError = false;

module.exports = logger;
