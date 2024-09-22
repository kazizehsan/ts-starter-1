/*
 * This file should not contain low level implementation.
 */

export interface IUserBaseModel {
  id?: any;
  name: string;
  email: string;
  password: string;
  role: string;
  isEmailVerified: boolean;
}

export interface UpdateUserBody extends Partial<Omit<IUserBaseModel, 'id'>> {};

export interface NewRegisteredUser extends Omit<IUserBaseModel, 'id' | 'role' | 'isEmailVerified'> {};

export interface NewCreatedUser extends Omit<IUserBaseModel, 'id' | 'isEmailVerified'> {};
