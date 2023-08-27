import Joi from 'joi';

export const userBody = Joi.object({
    username: Joi.string().min(5).required(),
    password: Joi.string().min(5).required()
});
