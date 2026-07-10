export class AppError extends Error {
    public readonly statusCode: number;
    public readonly errorCode: string;
    public readonly details: string[];

    constructor(statusCode: number, errorCode: string, message: string, details: string[] = []) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found', details: string[] = []) {
        super(404, 'RESOURCE_NOT_FOUND', message, details);
    }
}

export class ConflictError extends AppError {
    constructor(message: string = 'Resource already exists', details: string[] = []) {
        super(409, 'RESOURCE_CONFLICT', message, details);
    }
}

export class ValidationError extends AppError {
    constructor(message: string = 'Validation failed', details: string[] = []) {
        super(400, 'VALIDATION_ERROR', message, details);
    }
}
