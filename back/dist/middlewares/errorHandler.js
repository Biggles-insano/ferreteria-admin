"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error(err); // Log for server side debugging
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    // Hide stack trace in production (or always if requested by user preference)
    // For now we will hide it to prevent info disclosure as requested
    res.status(statusCode).json({
        error: message,
        // stack: process.env.NODE_ENV === 'production' ? null : err.stack 
    });
};
exports.errorHandler = errorHandler;
