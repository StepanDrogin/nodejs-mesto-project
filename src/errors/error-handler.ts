import { ErrorRequestHandler } from 'express';
import StatusCodes from '../constants/status-codes';

const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  const { statusCode = StatusCodes.INTERNAL_SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === StatusCodes.INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
  });
};

export default errorHandler;
