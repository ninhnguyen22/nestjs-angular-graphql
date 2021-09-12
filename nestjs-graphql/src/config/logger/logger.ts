import * as winston from 'winston';
import * as moment from 'moment';

const LOGS_FOLDER_PATH = `${__dirname}/../../..`;
const LOG_FILE_NAME = 'app.log';
const LOG_FILE_PATH = LOGS_FOLDER_PATH + '/' + LOG_FILE_NAME;
const options = {
  file: {
    filename: LOG_FILE_PATH,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const message = Symbol.for('message');
const jsonFormatter = logEntry => {
  const base = { timestamp: moment().format('YYYY-MM-DD HH:mm:ss') };
  const json = Object.assign(base, logEntry);
  logEntry[message] = JSON.stringify(json);
  return logEntry;
};

const logger = winston.createLogger({
  format: winston.format(jsonFormatter)(),
  transports: [
    new winston.transports.File({ ...options.file, level: 'error' }),
    new winston.transports.File({ ...options.file, level: 'info' }),
  ],
});

export default logger;
