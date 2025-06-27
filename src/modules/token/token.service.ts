import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';
import httpStatus from 'http-status';
import config from '@/config/config.js';
import Token from '@/modules/token/token.model.js';
import ApiError from '@/lib/errors/ApiError.js';
import tokenTypes from '@/modules/token/token.types.js';
import { AccessAndRefreshTokens, ITokenBaseModel } from '@/modules/token/token.interfaces.js';
import { userService } from '@/modules/user/index.js';
import { IUserBaseModel } from '@/modules/user/user.interfaces.js';
import { IPayload } from '@/modules/auth/passport.js';

/**
 * Generate token
 * @param {string} userId
 * @param {DateTime} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
export const generateToken = (
  userId: string,
  expires: DateTime,
  type: string,
  secret: string = config.jwt.secret
): string => {
  const payload: IPayload = {
    sub: userId,
    iat: Math.floor(DateTime.now().toSeconds()),
    exp: Math.floor(expires.toSeconds()),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {string} userId
 * @param {DateTime} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<ITokenBaseModel>}
 */
export const saveToken = async (
  token: string,
  userId: string,
  expires: DateTime,
  type: string,
  blacklisted: boolean = false
): Promise<ITokenBaseModel> => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toJSDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<ITokenBaseModel>}
 */
export const verifyToken = async (token: string, type: string): Promise<ITokenBaseModel> => {
  const payload = jwt.verify(token, config.jwt.secret);
  if (typeof payload.sub !== 'string') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'bad user');
  }
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {IUserBaseModel} user
 * @returns {Promise<AccessAndRefreshTokens>}
 */
export const generateAuthTokens = async (user: IUserBaseModel): Promise<AccessAndRefreshTokens> => {
  const accessTokenExpires = DateTime.now().plus({ minutes: Number(config.jwt.accessExpirationMinutes) });
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = DateTime.now().plus({ days: Number(config.jwt.refreshExpirationDays) });
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toJSDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toJSDate(),
    },
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
export const generateResetPasswordToken = async (email: string): Promise<string> => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  const expires = DateTime.now().plus({ minutes: Number(config.jwt.resetPasswordExpirationMinutes) });
  const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
  await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {IUserBaseModel} user
 * @returns {Promise<string>}
 */
export const generateVerifyEmailToken = async (user: IUserBaseModel): Promise<string> => {
  const expires = DateTime.now().plus({ minutes: Number(config.jwt.verifyEmailExpirationMinutes) });
  const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};
