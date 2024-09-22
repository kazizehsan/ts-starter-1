import { AccessAndRefreshTokens } from '../token/token.interfaces.js';
import { IUserBaseModel } from '../user/user.interfaces.js';

export interface IUserWithTokens {
  user: IUserBaseModel;
  tokens: AccessAndRefreshTokens;
}
