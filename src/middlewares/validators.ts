import { celebrate, Joi, Segments } from 'celebrate';

const validateSignUpUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().uri(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateSignInUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateUserId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
});

const validateUpdateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
  }),
});

const validateUpdateUserAvatar = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().uri().required().messages({
      'string.uri': 'Некорректный URL аватара',
      'any.required': 'Не передан URL аватара',
    }),
  }),
});

const validateCreateCard = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Название карточки должно быть не короче 2 символов',
        'string.max': 'Название карточки должно быть не длиннее 30 символов',
        'any.required': 'Название карточки обязательно',
      }),
    link: Joi.string().uri().required().messages({
      'string.uri': 'Некорректный URL изображения карточки',
      'any.required': 'Ссылка на изображение обязательна',
    }),
  }),
});

const validateCardId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required()
      .messages({
        'string.hex': '_id карточки должен быть в hex-формате',
        'string.length': '_id карточки должен содержать 24 символа',
        'any.required': '_id карточки обязателен',
      }),
  }),
});

export {
  validateSignUpUser,
  validateSignInUser,
  validateUserId,
  validateUpdateUser,
  validateUpdateUserAvatar,
  validateCreateCard,
  validateCardId,
};
