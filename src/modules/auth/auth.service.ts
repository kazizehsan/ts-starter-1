import httpStatus from 'http-status';
import Token, { ITokenDoc } from '../token/token.model.js';
import ApiError from '../errors/ApiError.js';
import tokenTypes from '../token/token.types.js';
import { getUserByEmail, getUserById, updateUserById } from '../user/user.service.js';
import { generateAuthTokens, verifyToken } from '../token/token.service.js';
import { IUserWithTokens } from './auth.interfaces.js';
import { IUserBaseModel } from '../user/user.interfaces.js';
import { IUserDoc } from '../user/user.model.js';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<IUserBaseModel>}
 */
export const loginUserWithEmailAndPassword = async (email: string, password: string): Promise<IUserBaseModel> => {
  const user = (await getUserByEmail(email)) as IUserDoc;
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
export const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.deleteOne();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<IUserWithTokens>}
 */
export const refreshAuth = async (refreshToken: string): Promise<IUserWithTokens> => {
  try {
    const refreshTokenDoc = (await verifyToken(refreshToken, tokenTypes.REFRESH)) as ITokenDoc;
    const user = await getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }
    await refreshTokenDoc.deleteOne();
    const tokens = await generateAuthTokens(user);
    return { user, tokens };
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export const resetPassword = async (resetPasswordToken: any, newPassword: string): Promise<void> => {
  try {
    const resetPasswordTokenDoc = await verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }
    await updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise<IUserBaseModel | null>}
 */
export const verifyEmail = async (verifyEmailToken: any): Promise<IUserBaseModel | null> => {
  try {
    const verifyEmailTokenDoc = await verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    const updatedUser = await updateUserById(user.id, { isEmailVerified: true });
    return updatedUser;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};
