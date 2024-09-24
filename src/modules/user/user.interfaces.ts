import { ROLES } from './../../config/roles.js';

type ROLE = keyof typeof ROLES;

export interface IUserBaseModel {
  id?: any;
  name: string;
  email: string;
  /**
   * @minLength 8 must contain minimum 8 characters
   */
  password: string;
  role: ROLE;
  isEmailVerified: boolean;
}

export interface UpdateUserBody extends Partial<Omit<IUserBaseModel, 'id'>> {}

export interface NewRegisteredUser extends Omit<IUserBaseModel, 'id' | 'role' | 'isEmailVerified'> {}

export interface NewCreatedUser extends Omit<IUserBaseModel, 'id' | 'isEmailVerified'> {}
