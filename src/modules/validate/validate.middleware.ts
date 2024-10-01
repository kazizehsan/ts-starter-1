import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import httpStatus from 'http-status';
import pick from '../utils/pick.js';
import ApiError, { IApiErrorDetail } from '../errors/ApiError.js';

const validate =
  (schema: Record<string, any>) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
      .prefs({ errors: { label: 'key' } })
      .validate(object, { abortEarly: false });

    if (error) {
      const errorMessage = error.details.map((details) => details.message).join(', ');
      const errorDetails: IApiErrorDetail[] = error.details.map((detail) => {
        return {
          message: detail.message,
          field: detail.context?.key || '',
          value: detail.context?.value || '',
          path: detail.path?.length > 0 ? detail.path[0]!.toString() : '',
        };
      });
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage, true, '', errorDetails));
    }
    Object.assign(req, value);
    return next();
  };

export default validate;
