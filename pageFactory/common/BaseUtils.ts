import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Create a 'logs' directory in the project root if it doesn't exist
const logDir = path.join(process.cwd(), 'logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Create Winston logger instance
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize({ all: true }), // Adds color to console logs
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(info => `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message}`)
  ),
  transports: [
    // Output to console
    new winston.transports.Console(),
    // Save to file
    new winston.transports.File({
      filename: path.join(logDir, 'execution.log'),
      level: 'info'
    })
  ]
});

// ✅ Safe wrapper methods for easier use in framework
export const logInfo = (message: string): void => {
  logger.info(message);
};

export const logError = (message: string): void => {
  logger.error(message);
};

export const logWarn = (message: string): void => {
  logger.warn(message);
};

// ✅ Example usage:
// logInfo('Test started');
// logError('Something went wrong');
// logger.info(`Cookies are ----> ${cookies}`);
