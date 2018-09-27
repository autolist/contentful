import { createLogger, format, transports } from 'winston';

export default createLogger({
  level: process.env.NODE_ENV === 'production' ? 'error' : 'info',
  format: format.simple(),
  transports: [new transports.Console()]
});
