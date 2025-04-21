import { ObjectId } from 'mongoose';
// eslint-disable-next-line no-unused-vars
import { Request } from 'express';

declare module 'express-serve-static-core' {
  // eslint-disable-next-line no-unused-vars, no-shadow
  interface Request {
    user?: {
      _id: string | ObjectId;
    };
  }
}
