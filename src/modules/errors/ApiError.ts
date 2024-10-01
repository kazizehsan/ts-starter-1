export interface IApiErrorDetail {
  message: string;
  field?: string;
  value?: any;
  path?: string;
}

class ApiError extends Error {
  statusCode: number;

  isOperational: boolean;

  override stack?: string;

  details: IApiErrorDetail[] | undefined;

  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    stack = '',
    details: IApiErrorDetail[] | undefined = undefined
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
