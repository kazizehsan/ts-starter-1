import { Request as ExpRequest} from 'express';
import { tokenService } from '../token/index.js';
import { userService } from '../user/index.js';
import * as authService from './auth.service.js';
import { emailService } from '../email/index.js';
import { Body, Controller, Post, Route, Response, SuccessResponse, Middlewares, Tags, Query, Security, Request } from 'tsoa';
import { NewRegisteredUser } from '../user/user.interfaces.js';
import { IUserWithTokens } from './auth.interfaces.js';
import { IApiError } from '../errors/error.js';
import validate from '../validate/validate.middleware.js';
import * as authValidation from './auth.validation.js';
import auth from './auth.middleware.js';

@Route('v1/auth')
@Tags('Auth')
export class AuthController extends Controller {
  /**
   * Self registration for new users.
   */
  @Response<IApiError>(400, 'Validation failed.')
  @Response<IApiError>(422, 'Unprocessable entity.')
  @SuccessResponse('201', 'Created.')
  @Middlewares(validate(authValidation.register))
  @Post('register')
  public async register(@Body() requestBody: NewRegisteredUser): Promise<IUserWithTokens> {
    const user = await userService.registerUser(requestBody);
    const tokens = await tokenService.generateAuthTokens(user);
    return { user, tokens };
  }

  @Response<IApiError>(400, 'Validation failed.')
  @Response<IApiError>(401, 'Incorrect email or password.')
  @SuccessResponse('200', 'Success.')
  @Middlewares(validate(authValidation.login))
  @Post('login')
  public async login(@Body() requestBody: { email: string; password: string }): Promise<IUserWithTokens> {
    const user = await authService.loginUserWithEmailAndPassword(requestBody.email, requestBody.password);
    const tokens = await tokenService.generateAuthTokens(user);
    return { user, tokens };
  }

  @Response<IApiError>(400, 'Validation failed.')
  @Response<IApiError>(404, 'Not Found.')
  @SuccessResponse('204', 'Success.')
  @Middlewares(validate(authValidation.logout))
  @Post('logout')
  public async logout(@Body() requestBody: { refreshToken: string }): Promise<void> {
    await authService.logout(requestBody.refreshToken);
    return;
  }

  @Response<IApiError>(401, 'Unauthorized.')
  @Response<IApiError>(404, 'Not Found.')
  @SuccessResponse('200', 'Success.')
  @Middlewares(validate(authValidation.refreshTokens))
  @Post('refresh-tokens')
  public async refreshTokens(@Body() requestBody: { refreshToken: string }): Promise<IUserWithTokens> {
    const userWithTokens = await authService.refreshAuth(requestBody.refreshToken);
    return userWithTokens;
  }

  @Response<IApiError>(404, 'Not Found.')
  @SuccessResponse('204', 'Success.')
  @Middlewares(validate(authValidation.forgotPassword))
  @Post('forgot-password')
  public async forgotPassword(@Body() requestBody: { email: string }): Promise<void> {
    const resetPasswordToken = await tokenService.generateResetPasswordToken(requestBody.email);
    await emailService.sendResetPasswordEmail(requestBody.email, resetPasswordToken);
    return;
  }

  @Response<IApiError>(400, 'Validation failed.')
  @Response<IApiError>(401, 'Unauthorized.')
  @Response<IApiError>(404, 'Not Found.')
  @SuccessResponse('204', 'Success.')
  @Middlewares(validate(authValidation.resetPassword))
  @Post('reset-password')
  public async resetPassword(@Query() token: string, @Body() requestBody: { password: string }): Promise<void> {
    await authService.resetPassword(token, requestBody.password);
    return;
  }

  @Response<IApiError>(401, 'Unauthorized.')
  @SuccessResponse('204', 'Success.')
  @Security('jwt') // just adds auth specs to openapi
  @Middlewares(auth()) // actually handles auth
  @Post('send-verification-email')
  public async sendVerificationEmail(@Request() req: ExpRequest): Promise<void> {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
    await emailService.sendVerificationEmail(req.user.email, verifyEmailToken, req.user.name);
    return;
  }

  @Response<IApiError>(400, 'Validation failed.')
  @Response<IApiError>(401, 'Email verification failed.')
  @Response<IApiError>(404, 'Not Found.')
  @SuccessResponse('204', 'Success.')
  @Middlewares(validate(authValidation.verifyEmail))
  @Post('verify-email')
  public async verifyEmail(@Query() token: string): Promise<void> {
    await authService.verifyEmail(token);
    return;
  }
}
