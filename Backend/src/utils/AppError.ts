export class AppError extends Error {
    public readonly statusCode: number;
    public readonly status: string;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; // To distinguish operational errors from programming errors

        Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain
        Error.captureStackTrace(this, this.constructor);
    }
}