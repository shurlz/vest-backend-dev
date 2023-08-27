import Joi from 'joi';

export const postBody = Joi.object({
    title: Joi.string().min(5).required(),
    content: Joi.string().min(5).required()
});

export const postParams = Joi.object({
    id: Joi.number().required()
});