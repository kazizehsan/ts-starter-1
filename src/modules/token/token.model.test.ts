import { DateTime } from 'luxon';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import config from '@/config/config.js';
import { NewToken } from '@/modules/token/token.interfaces.js';
import tokenTypes from '@/modules/token/token.types.js';
import Token from '@/modules/token/token.model.js';
import * as tokenService from '@/modules/token/token.service.js';

const password = 'password1';
const accessTokenExpires = DateTime.now().plus({ minutes: Number(config.jwt.accessExpirationMinutes) });

const userOne = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false,
};

const userOneAccessToken = tokenService.generateToken(userOne._id.toString(), accessTokenExpires, tokenTypes.ACCESS);

describe('Token Model', () => {
  const refreshTokenExpires = DateTime.now().plus({ days: Number(config.jwt.refreshExpirationDays) });
  let newToken: NewToken;
  beforeEach(() => {
    newToken = {
      token: userOneAccessToken,
      user: userOne._id.toHexString(),
      type: tokenTypes.REFRESH,
      expires: refreshTokenExpires.toJSDate(),
    };
  });

  test('should correctly validate a valid token', async () => {
    await expect(new Token(newToken).validate()).resolves.toBeUndefined();
  });

  test('should throw a validation error if type is unknown', async () => {
    newToken.type = 'invalidType';
    await expect(new Token(newToken).validate()).rejects.toThrow();
  });
});
