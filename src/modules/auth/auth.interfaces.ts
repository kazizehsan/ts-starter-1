import { AccessAndRefreshTokens } from '@/modules/token/token.interfaces.js';
import { IUserBaseModel } from '@/modules/user/user.interfaces.js';

export interface IUserWithTokens {
  user: IUserBaseModel;
  tokens: AccessAndRefreshTokens;
}
