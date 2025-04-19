import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import userRoutes from './routes/users';
import cardRoutes from './routes/cards';

const app = express();
const PORT = 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Слишком много запросов с вашего IP, попробуйте позже' },
});

app.use(limiter);
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => {
    console.log('Успешное подключение к MongoDB');
  })
  .catch((err) => {
    console.error('Ошибка подключения к MongoDB:', err);
  });

app.use((req: Request, _res: Response, next: NextFunction) => {
  req.user = {
    _id: '68036a6de7829817f540128a',
  };
  next();
});

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.use('*', (_req: Request, res: Response) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use((err: Error, _req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).send({ message: 'На сервере произошла ошибка' });
});

app.listen(PORT, () => {
  console.log(`Сервер работает на http://localhost:${PORT}`);
});
