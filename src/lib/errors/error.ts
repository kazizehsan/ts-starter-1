/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import tsoa from 'tsoa';
import httpStatus from 'http-status';
import config from '@/config/config.js';
import { logger } from '@/lib/logger/index.js';
import ApiError, { IApiErrorDetail } from './ApiError.js';

export interface IApiError {
  code: number;
  message: string;
  details: IApiErrorDetail[] | undefined;
  stack?: string;
}

export const errorConverter = (err: any, _req: Request, _res: Response, next: NextFunction) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    let fallbackStatusCode = httpStatus.INTERNAL_SERVER_ERROR;
    if (error instanceof mongoose.Error) {
      fallbackStatusCode = httpStatus.BAD_REQUEST;
    } else if (error instanceof tsoa.ValidateError) {
      fallbackStatusCode = httpStatus.UNPROCESSABLE_ENTITY;
    }
    const statusCode = error.statusCode || fallbackStatusCode;

    let message: string = '';
    if (error instanceof tsoa.ValidateError) {
      message = Object.entries(error.fields)
        .map(([key, value]) => `${key}: ${value.message}`)
        .join(', ');
    }
    if (!message) {
      message = error.message || `${httpStatus[statusCode]}`;
    }
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = 'Internal Server Error';
  }

  res.locals['errorMessage'] = err.message;

  const response: IApiError = {
    code: statusCode,
    message,
    details: err.details,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};
