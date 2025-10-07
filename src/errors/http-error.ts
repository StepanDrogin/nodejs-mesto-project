import StatusCodes from '../constants/status-codes';
import { IError } from './types';

class HttpError extends Error {
  public statusCode: number;

  constructor(statusCode: number, error: IError) {
    super(error.message);
    this.statusCode = statusCode;
    this.message = error.message;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(error: IError) {
    return new HttpError(StatusCodes.BAD_REQUEST, error);
  }

  static forbidden(error: IError) {
    return new HttpError(StatusCodes.FORBIDDEN, error);
  }

  static notFound(error: IError) {
    return new HttpError(StatusCodes.NOT_FOUND, error);
  }

  static conflict(error: IError) {
    return new HttpError(StatusCodes.CONFLICT, error);
  }

  static unauthorized(error: IError) {
    return new HttpError(StatusCodes.UNAUTHORIZED, error);
  }
}

export default HttpError;
