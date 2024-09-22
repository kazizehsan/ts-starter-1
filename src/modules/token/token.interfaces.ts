
export interface ITokenBaseModel {
  token: string;
  user: string;
  type: string;
  expires: Date;
  blacklisted: boolean;
}

export interface ITokenHLModel extends ITokenBaseModel {
  id?: any;
}

export type NewToken = Omit<ITokenBaseModel, 'blacklisted'>;

export interface TokenPayload {
  token: string;
  expires: Date;
}

export interface AccessAndRefreshTokens {
  access: TokenPayload;
  refresh: TokenPayload;
}
