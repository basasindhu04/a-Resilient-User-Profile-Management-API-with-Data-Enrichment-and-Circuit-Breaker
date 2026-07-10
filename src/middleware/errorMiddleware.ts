import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/Errors';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`[Error] ${err.name}: ${err.message}`, err.stack);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            errorCode: err.errorCode,
            message: err.message,
            details: err.details.length > 0 ? err.details : undefined
        });
    }

    // Unhandled or native errors
    res.status(500).json({
        errorCode: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred.',
        details: []
    });
};
