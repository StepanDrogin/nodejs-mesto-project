import mongoose, { Schema, Document } from 'mongoose';
import validator from 'validator';

interface IUser extends Document {
  email: string
  password: string
  name: string
  about: string
  avatar: string
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: 'Некорректный email',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: 2,
      maxlength: 30,
    },
    about: {
      type: String,
      default: 'Исследователь',
      minlength: 2,
      maxlength: 200,
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg',
      validate: {
        validator(v: string) {
          return /^https?:\/\/(www\.)?[\w-]+\.[\w]{2,}([/\w\-._~:/?#[\]@!$&'()*+,;=]*)#?$/.test(v);
        },
        message: 'Некорректный URL аватара',
      },
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform(_doc, ret) {
        const { password, ...rest } = ret;
        return rest;
      },
    },
  },
);

export default mongoose.model<IUser>('user', userSchema);
