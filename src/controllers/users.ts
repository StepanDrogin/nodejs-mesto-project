import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import BadRequestError from '../errors/BadRequestError';
import ConflictError from '../errors/ConflictError';
import UnauthorizedError from '../errors/UnauthorizedError';

const { JWT_SECRET = 'default-secret' } = process.env;

export const getUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      next(new BadRequestError('Пользователь не найден'));
      return;
    }
    res.status(200).json(user);
  } catch (err: any) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Некорректный ID пользователя'));
    } else {
      next(err);
    }
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      next(new BadRequestError('Пользователь не найден'));
      return;
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      name,
      about,
      avatar,
      email,
      password,
    }: {
      name?: string
      about?: string
      avatar?: string
      email: string
      password: string
    } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    res.status(201).json(userWithoutPassword);
  } catch (err: any) {
    if (err.code === 11000) {
      next(new ConflictError('Пользователь с таким email уже существует'));
    } else if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
    } else {
      next(err);
    }
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      next(new UnauthorizedError('Неправильные почта или пароль'));
      return;
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.send({ token });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!user) {
      next(new BadRequestError('Пользователь не найден'));
      return;
    }

    res.status(200).json(user);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Некорректные данные при обновлении профиля'));
    } else {
      next(err);
    }
  }
};

export const updateAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!user) {
      next(new BadRequestError('Пользователь не найден'));
      return;
    }

    res.status(200).json(user);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Некорректные данные при обновлении аватара'));
    } else {
      next(err);
    }
  }
};
