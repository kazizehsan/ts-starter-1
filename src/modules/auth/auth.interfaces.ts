import { AccessAndRefreshTokens } from '../token/token.interfaces.js';
import { IUserHLModel } from '../user/user.interfaces.js';

export interface IUserWithTokens {
  user: IUserHLModel;
  tokens: AccessAndRefreshTokens;
}
