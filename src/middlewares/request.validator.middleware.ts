import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { BAD_REQUEST } from '../utils/statuscodes';
import { HttpException } from './http.exception.middleware';


export const validateRequest = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false
        });
        if (error) {
            console.log(error);
            const errorDetails = error.details;
            return next(new HttpException(BAD_REQUEST, errorDetails));
        }
        next();
    };

};