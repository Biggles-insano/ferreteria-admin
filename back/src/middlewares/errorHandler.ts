import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
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
