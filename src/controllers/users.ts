import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';
import StatusCodes from '../constants/status-codes';
import HttpError from '../errors/http-error';
import { RequestWithUser } from '../types/index';

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      next(HttpError.notFound({ message: 'Пользователи не добавлены' }));
    } else {
      res.status(StatusCodes.OK).send(users);
    }
  } catch (err) {
    next(err);
  }
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ _id: req.params.userId })
      .orFail(() => HttpError.notFound({ message: 'Пользователь по указанному _id не найден.' }));

    res.send(user);
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      next(HttpError.badRequest({ message: 'Передан некорректный _id пользователя.' }));
    } else {
      next(err);
    }
  }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  try {
    const hash: string = await bcrypt.hash(password, 10);
    const user: IUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(StatusCodes.CREATED).send(userResponse);
  } catch (err) {
    if ((err as { code: number }).code === 11000) {
      next(HttpError.conflict({ message: 'Пользователь существует' }));
    } else {
      next(err);
    }
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    about,
  } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      (req as RequestWithUser).user._id,
      {
        name,
        about,
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .orFail(() => HttpError.notFound({ message: 'Пользователь с указанным _id не найден.' }));

    res.status(StatusCodes.OK).send(user);
  } catch (err) {
    next(err);
  }
};

const updateUserAvatar = async (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      (req as RequestWithUser).user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    )
      .orFail(() => HttpError.notFound({ message: 'Пользователь с указанным _id не найден.' }));

    res.status(StatusCodes.OK)
      .send(user);
  } catch (err) {
    next(err);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'dev-key', {
      expiresIn: '7d',
    });
    res
      .cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
      .send({ message: 'ОК' });
  } catch (err) {
    next(err);
  }
};

const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById((req as RequestWithUser).user._id)
      .orFail(() => HttpError.notFound({ message: 'Пользователь не найден.' }));

    const { password, ...userInfo } = user.toObject();

    res.status(StatusCodes.OK).send(userInfo);
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      next(HttpError.badRequest({ message: 'Некорректный _id пользователя.' }));
    } else {
      next(err);
    }
  }
};

export {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
  getCurrentUser,
};
