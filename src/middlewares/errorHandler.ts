import { Request, Response } from 'express';

export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
) {
  const { statusCode = 500, message } = err;

  res.status(statusCode).json({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
}
