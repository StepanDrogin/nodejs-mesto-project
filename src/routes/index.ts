import {
  Request,
  Response,
  NextFunction,
  Router,
} from 'express';
import usersRouter from './users';
import cardsRouter from './cards';
import HttpError from '../errors/http-error';

const mainRouter = Router();

mainRouter.use('/users', usersRouter);
mainRouter.use('/cards', cardsRouter);

mainRouter.use((req: Request, res: Response, next: NextFunction) => {
  next(HttpError.notFound({ message: 'Страница не найдена' }));
});

export default mainRouter;
