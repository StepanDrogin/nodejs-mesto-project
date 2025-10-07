import { Router } from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  updateUserAvatar,
  getCurrentUser,
} from '../controllers/users';
import {
  validateUpdateUser,
  validateUpdateUserAvatar,
  validateUserId,
} from '../middlewares/validators';

const usersRouter = Router();

usersRouter.get('/', getUsers);
usersRouter.get('/me', getCurrentUser);
usersRouter.get('/:userId', validateUserId, getUser);
usersRouter.patch('/me', validateUpdateUser, updateUser);
usersRouter.patch('/me/avatar', validateUpdateUserAvatar, updateUserAvatar);

export default usersRouter;
