import Joi from 'joi';

export const commentParams = Joi.object({
    postId: Joi.number().required()
});

export const commentBody = Joi.object({
    content: Joi.string().min(5).required()
});