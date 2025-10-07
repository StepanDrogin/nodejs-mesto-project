import express from 'express';
import { errors } from 'celebrate';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mainRouter from './routes/index';
import errorHandler from './errors/error-handler';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import requestLogger from './middlewares/request-logger';
import errorLogger from './middlewares/error-logger';
import { validateSignInUser, validateSignUpUser } from './middlewares/validators';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(requestLogger);

app.post('/signup', validateSignUpUser, createUser);
app.post('/signin', validateSignInUser, login);

app.use(auth);
app.use(mainRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(+PORT, '0.0.0.0', () => console.log(`Server listening on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
