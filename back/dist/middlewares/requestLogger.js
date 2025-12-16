"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleLogger = exports.requestLogger = void 0;
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const rotating_file_stream_1 = require("rotating-file-stream");
// Create a rotating write stream
const accessLogStream = (0, rotating_file_stream_1.createStream)('access.log', {
    interval: '1d', // rotate daily
    path: path_1.default.join(__dirname, '../../logs'),
    maxFiles: 5, // keep 5 days of logs
});
// Ensure logs directory exists (optional, but good practice if not using fs.mkdir)
// rotating-file-stream usually handles file creation, but directory must exist.
// We will rely on it or create it manually if needed. 
// Actually, let's just point to root for now or ensure folder exists.
// Let's stick to root for simplicity or create a 'logs' folder.
// Setup the logger
exports.requestLogger = (0, morgan_1.default)('combined', { stream: accessLogStream });
// Also log to console for dev
exports.consoleLogger = (0, morgan_1.default)('dev');
