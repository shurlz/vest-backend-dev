import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';


export const ValidateBody = (Object: Joi.ObjectSchema) =>
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      await Object.validateAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof Joi.ValidationError) {
        return res.status(400).send({ message: error.message });
      }
      console.error(error);
      return res
        .status(500)
        .send({ message: 'Internal error during validation' });
    }
};


export const ValidateParams = (validationObject: Joi.ObjectSchema) =>
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      await validationObject.validateAsync(req.params);
      next();
    } catch (error) {
      if (error instanceof Joi.ValidationError) {
        return res.status(400).send({ message: error.message });
      }
      console.error(error);
      return res
        .status(500)
        .send({ message: 'Internal error during validation' });
    }
};