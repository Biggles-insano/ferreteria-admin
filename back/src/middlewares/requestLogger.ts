import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, '../../access.log'), { flags: 'a' });

// Setup the logger
export const requestLogger = morgan('combined', { stream: accessLogStream });

// Also log to console for dev
export const consoleLogger = morgan('dev');
