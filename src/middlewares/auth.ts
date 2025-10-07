import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import HttpError from '../errors/http-error';
import { RequestWithUser } from '../types/index';

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(HttpError.unauthorized({ message: 'Токен не найден, необходима авторизация' }));
    return;
  }

  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-key');
  } catch (err) {
    next(HttpError.unauthorized({ message: 'Неверный токен, необходима авторизация' }));
    return;
  }

  (req as RequestWithUser).user = payload as { _id: string };

  next();
};

export default auth;
