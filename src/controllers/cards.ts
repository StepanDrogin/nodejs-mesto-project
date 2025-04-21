import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import BadRequestError from '../errors/BadRequestError';
import NotFoundError from '../errors/NotFoundError';
import ForbiddenError from '../errors/ForbiddenError';

export const getCards = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const cards = await Card.find({});
    res.status(200).json(cards);
  } catch (err) {
    next(err);
  }
};

export const createCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, link } = req.body;
    const owner = req.user?._id;

    const card = await Card.create({ name, link, owner });
    res.status(201).json(card);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      next(
        new BadRequestError('Переданы некорректные данные при создании карточки'),
      );
    } else {
      next(err);
    }
  }
};

export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const card = await Card.findById(req.params.cardId);

    if (!card) {
      next(new NotFoundError('Карточка не найдена'));
      return;
    }

    if (card.owner.toString() !== req.user?._id) {
      next(new ForbiddenError('Нельзя удалять чужую карточку'));
      return;
    }

    await card.deleteOne();
    res.status(200).json({ message: 'Карточка удалена' });
  } catch (err: any) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Некорректный ID карточки'));
    } else {
      next(err);
    }
  }
};

export const likeCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user?._id } },
      { new: true },
    );

    if (!card) {
      next(new NotFoundError('Карточка не найдена'));
      return;
    }

    res.status(200).json(card);
  } catch (err: any) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Некорректный ID карточки'));
    } else {
      next(err);
    }
  }
};

export const dislikeCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user?._id } },
      { new: true },
    );

    if (!card) {
      next(new NotFoundError('Карточка не найдена'));
      return;
    }

    res.status(200).json(card);
  } catch (err: any) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Некорректный ID карточки'));
    } else {
      next(err);
    }
  }
};
