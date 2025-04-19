import { Request, Response } from 'express';
import Card from '../models/card';

export const getCards = async (_req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch {
    return res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).send({ message: 'Не авторизован' });
    }

    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    return res.status(201).send(card);
  } catch {
    return res.status(400).send({ message: 'Ошибка при создании карточки' });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.cardId);
    if (!card) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }
    return res.send(card);
  } catch {
    return res.status(400).send({ message: 'Некорректный id карточки' });
  }
};

export const likeCard = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).send({ message: 'Не авторизован' });
    }

    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }

    return res.send(card);
  } catch {
    return res.status(400).send({ message: 'Некорректный id карточки' });
  }
};

export const dislikeCard = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).send({ message: 'Не авторизован' });
    }

    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }

    return res.send(card);
  } catch {
    return res.status(400).send({ message: 'Некорректный id карточки' });
  }
};
