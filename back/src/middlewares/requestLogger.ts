import morgan from 'morgan';
import path from 'path';
import { createStream } from 'rotating-file-stream';

// Create a rotating write stream
const accessLogStream = createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, '../../logs'),
    maxFiles: 5, // keep 5 days of logs
});

// Ensure logs directory exists (optional, but good practice if not using fs.mkdir)
// rotating-file-stream usually handles file creation, but directory must exist.
// We will rely on it or create it manually if needed. 
// Actually, let's just point to root for now or ensure folder exists.
// Let's stick to root for simplicity or create a 'logs' folder.

// Setup the logger
export const requestLogger = morgan('combined', { stream: accessLogStream });

// Also log to console for dev
export const consoleLogger = morgan('dev');
