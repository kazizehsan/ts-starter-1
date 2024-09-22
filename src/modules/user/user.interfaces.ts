/*
 * This file should not contain low level implementation.
 */

export interface IUserBaseModel {
  name: string;
  email: string;
  password: string;
  role: string;
  isEmailVerified: boolean;
}

export interface IUserHLModel extends IUserBaseModel {
  id?: any;
}

export type UpdateUserBody = Partial<IUserBaseModel>;

export type NewRegisteredUser = Omit<IUserBaseModel, 'role' | 'isEmailVerified'>;

export type NewCreatedUser = Omit<IUserBaseModel, 'isEmailVerified'>;
