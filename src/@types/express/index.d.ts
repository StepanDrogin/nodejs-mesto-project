/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ObjectId } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string | ObjectId
      }
    }
  }
}

export {};
