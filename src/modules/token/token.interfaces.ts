
export interface ITokenBaseModel {
  id?: any;
  token: string;
  user: string;
  type: string;
  expires: Date;
  blacklisted: boolean;
}

export interface NewToken extends Omit<ITokenBaseModel, 'id' | 'blacklisted'> {};

export interface TokenPayload {
  token: string;
  expires: Date;
}

export interface AccessAndRefreshTokens {
  access: TokenPayload;
  refresh: TokenPayload;
}
