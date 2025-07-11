import { IUserBaseModel } from '@/modules/user/user.interfaces.js';

declare module 'express-serve-static-core' {
  export interface Request {
    user: IUserBaseModel;
  }
}
