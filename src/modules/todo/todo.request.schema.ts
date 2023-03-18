import joi from 'joi';


export const TodoCreateSchema = joi.object({
    title: joi.string().required(),
    desc: joi.string().required()
});


export const TodoUpdateSchema = joi.object({
    title: joi.string().optional(),
    desc: joi.string().optional(),
    isDone: joi.boolean().optional()
}).or('title', 'desc', 'isDone');


