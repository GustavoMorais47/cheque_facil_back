import moment from "moment";
import winston from "winston";
import "moment/locale/pt-br";

moment.locale("pt-br");

const PATH_LOGS = process.env.PATH_LOGS as string;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: `${PATH_LOGS}\\${moment().format('DD-MM-YYYY HH-mm-ss').replace(/:/g, '-')}.log`,
      level: "info",
      maxsize: 1 * 1024 * 1024,
      maxFiles: 7, 
    }),
  ],
});

export default logger;
