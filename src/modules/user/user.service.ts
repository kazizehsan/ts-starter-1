import httpStatus from 'http-status';
import mongoose from 'mongoose';
import User from './user.model.js';
import ApiError from '../errors/ApiError.js';
import { IOptions, QueryResult } from '../paginate/paginate.js';
import { NewCreatedUser, UpdateUserBody, NewRegisteredUser, IUserBaseModel } from './user.interfaces.js';

/**
 * Create a user
 * @param {NewCreatedUser} userBody
 * @returns {Promise<IUserBaseModel>}
 */
export const createUser = async (userBody: NewCreatedUser): Promise<IUserBaseModel> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return await User.create(userBody);
};

/**
 * Register a user
 * @param {NewRegisteredUser} userBody
 * @returns {Promise<IUserBaseModel>}
 */
export const registerUser = async (userBody: NewRegisteredUser): Promise<IUserBaseModel> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return await User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult<IUserBaseModel>>}
 */
export const queryUsers = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult<IUserBaseModel>> => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<IUserBaseModel | null>}
 */
export const getUserById = async (id: string): Promise<IUserBaseModel | null> => User.findById(id);

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<IUserBaseModel | null>}
 */
export const getUserByEmail = async (email: string): Promise<IUserBaseModel | null> => User.findOne({ email });

/**
 * Update user by id
 * @param {string} userId
 * @param {UpdateUserBody} updateBody
 * @returns {Promise<IUserBaseModel | null>}
 */
export const updateUserById = async (userId: string, updateBody: UpdateUserBody): Promise<IUserBaseModel | null> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, new mongoose.Types.ObjectId(userId)))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {string} userId
 * @returns {Promise<IUserBaseModel | null>}
 */
export const deleteUserById = async (userId: string): Promise<IUserBaseModel | null> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.deleteOne();
  return user;
};
