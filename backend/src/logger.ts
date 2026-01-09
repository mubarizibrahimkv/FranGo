import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import fs from "fs";
import path from "path";

const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.printf(({ level, message, timestamp, stack }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
    })
  ),
  transports: [
    ...(process.env.NODE_ENV !== "production"
      ? [new transports.Console()]
      : []),

    new DailyRotateFile({
      filename: "logs/app-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxFiles: "10d",
    }),

    new DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      level: "error",
      datePattern: "YYYY-MM-DD",
      maxFiles: "30d",
    }),
  ],
});

export default logger;
