import { NextFunction, Request, Response } from 'express';
import { INTERNAL_SERVER_ERROR } from '../utils/statuscodes';
import joi from 'joi';

class HttpException extends Error {
    public status: number;
    public messages: string | joi.ValidationErrorItem[];

    constructor(status?: number, message?: string | joi.ValidationErrorItem[]) {
        super();
        this.status = status || INTERNAL_SERVER_ERROR;
        this.messages = message || 'Something went wrong';       
    }
}

const httpExceptionMiddleware = (
    error: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const status = error.status;
    const message = error.messages;

    res.status(status).send({
        status,
        message,
    });
};

export {
    HttpException,
    httpExceptionMiddleware
};