import { NextFunction, Request, Response } from 'express';
import { INTERNAL_SERVER_ERROR } from '../utils/statuscodes';

class HttpException extends Error {
    public status: number;
    public message: string;

    constructor(status?: number, message?: string) {
        super(message);
        this.status = status || INTERNAL_SERVER_ERROR;
        this.message = message || 'Something went wrong';       
    }
}

const httpExceptionMiddleware = (
    error: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const status = error.status;
    const message = error.message;

    res.status(status).send({
        status,
        message,
    });
};

export {
    HttpException,
    httpExceptionMiddleware
};