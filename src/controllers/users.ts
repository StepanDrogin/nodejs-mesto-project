import { Request, Response } from 'express';
import User from '../models/user';

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch {
    return res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send({ message: 'Пользователь не найден' });
    }
    return res.send(user);
  } catch {
    return res.status(400).send({ message: 'Некорректный id пользователя' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.status(201).send(user);
  } catch {
    return res.status(400).send({ message: 'Ошибка при создании пользователя' });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).send({ message: 'Не авторизован' });
    }

    const { name, about } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(404).send({ message: 'Пользователь не найден' });
    }

    return res.send(user);
  } catch {
    return res.status(400).send({ message: 'Ошибка при обновлении профиля' });
  }
};

export const updateUserAvatar = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).send({ message: 'Не авторизован' });
    }

    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(404).send({ message: 'Пользователь не найден' });
    }

    return res.send(user);
  } catch {
    return res.status(400).send({ message: 'Ошибка при обновлении аватара' });
  }
};
