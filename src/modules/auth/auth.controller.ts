import httpStatus from 'http-status';
import { Request as ExpRequest, Response as ExpResponse } from 'express';
import catchAsync from '../utils/catchAsync.js';
import { tokenService } from '../token/index.js';
import { userService } from '../user/index.js';
import * as authService from './auth.service.js';
import { emailService } from '../email/index.js';
import { Body, Controller, Post, Route, Response, SuccessResponse } from 'tsoa';
import { NewRegisteredUser } from '../user/user.interfaces.js';
import { IUserWithTokens } from './auth.interfaces.js';
import { IApiError } from '../errors/error.js';

@Route('v1/auth')
export class AuthController extends Controller {
  @Response<IApiError>(400, 'Validation Failed')
  @Response<IApiError>(422, 'Unprocessable Entity')
  @SuccessResponse('201', 'Created')
  @Post('register')
  public async register(@Body() requestBody: NewRegisteredUser): Promise<IUserWithTokens> {
    const user = await userService.registerUser(requestBody);
    const tokens = await tokenService.generateAuthTokens(user);
    return { user, tokens };
  }

  @SuccessResponse('200')
  @Post('login')
  public async login(@Body() requestBody: { email: string; password: string }): Promise<IUserWithTokens> {
    const user = await authService.loginUserWithEmailAndPassword(requestBody.email, requestBody.password);
    const tokens = await tokenService.generateAuthTokens(user);
    return { user, tokens };
  }
}

export const register = catchAsync(async (req: ExpRequest, res: ExpResponse) => {
  const user = await userService.registerUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

export const login = catchAsync(async (req: ExpRequest, res: ExpResponse) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

export const logout = catchAsync(async (req: ExpRequest, res: ExpResponse) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

export const refreshTokens = catchAsync(async (req: ExpRequest, res: ExpResponse) => {
  const userWithTokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...userWithTokens });
});

export const forgotPassword = catchAsync(async (req: ExpRequest, res: ExpResponse) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

export const resetPassword = catchAsync(async (req: ExpRequest, res: ExpResponse) => {
  await authService.resetPassword(req.query['token'], req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

export const sendVerificationEmail = catchAsync(async (req: ExpRequest, res: ExpResponse) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken, req.user.name);
  res.status(httpStatus.NO_CONTENT).send();
});

export const verifyEmail = catchAsync(async (req: ExpRequest, res: ExpResponse) => {
  await authService.verifyEmail(req.query['token']);
  res.status(httpStatus.NO_CONTENT).send();
});
