import httpStatus from 'http-status';
import { Request as ExpRequest, Response as ExpResponse } from 'express';
import catchAsync from '../utils/catchAsync.js';
import ApiError from '../errors/ApiError.js';
import pick from '../utils/pick.js';
import { IOptions } from '../paginate/paginate.js';
import * as userService from './user.service.js';
import {
  Body,
  Controller,
  Get,
  Middlewares,
  Path,
  Post,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';
import { IApiError } from '../errors/error.js';
import auth from './../auth/auth.middleware.js';
import { IUserBaseModel, NewCreatedUser } from './user.interfaces.js';
import { PERMISSIONS } from './../../config/roles.js';
import validate from '../validate/validate.middleware.js';
import * as userValidation from './user.validation.js';

@Route('v1/users')
@Tags('Users')
export class UserController extends Controller {
  /**
   * Create users by admin.
   */
  @Response<IApiError>(400, 'Validation failed.')
  @Response<IApiError>(401, 'Unauthorized')
  @Response<IApiError>(403, 'Forbidden')
  @Response<IApiError>(422, 'Unprocessable entity.')
  @SuccessResponse('201', 'Created.')
  @Middlewares(validate(userValidation.createUser))
  @Security('jwt') // just adds auth specs to openapi
  @Middlewares(auth(PERMISSIONS.manageUsers)) // actually handles auth
  @Post()
  public async createUser(@Body() requestBody: NewCreatedUser): Promise<IUserBaseModel> {
    const user = await userService.createUser(requestBody);
    return user;
  }

  @Response<IApiError>(401, 'Unauthorized')
  @SuccessResponse('200', 'Success')
  @Security('jwt') // just adds auth specs to openapi
  @Middlewares(auth()) // actually handles auth
  @Get('me')
  public async getMe(@Request() req: ExpRequest): Promise<IUserBaseModel> {
    const user = await userService.getUserById(req.user.id);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    return user;
  }

  @Response<IApiError>(400, 'Validation failed.')
  @Response<IApiError>(401, 'Unauthorized')
  @Response<IApiError>(403, 'Forbidden')
  @Response<IApiError>(404, 'Not Found')
  @SuccessResponse('200', 'Success')
  @Middlewares(validate(userValidation.getUser))
  @Security('jwt') // just adds auth specs to openapi
  @Middlewares(auth(PERMISSIONS.getUsers)) // actually handles auth
  @Get('{userId}')
  public async getUser(@Path() userId: string): Promise<IUserBaseModel> {
    const user = await userService.getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    return user;
  }
}

export const createUser = catchAsync(async (req: ExpRequest, res: ExpResponse) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

export const getUsers = catchAsync(async (req: ExpRequest, res: ExpResponse) => {
  const filter = pick(req.query, ['name', 'role']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

export const getUser = catchAsync(async (req: ExpRequest, res: ExpResponse) => {
  if (typeof req.params['userId'] === 'string') {
    const user = await userService.getUserById(req.params['userId']);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.send(user);
  }
});

export const updateUser = catchAsync(async (req: ExpRequest, res: ExpResponse) => {
  if (typeof req.params['userId'] === 'string') {
    const user = await userService.updateUserById(req.params['userId'], req.body);
    res.send(user);
  }
});

export const deleteUser = catchAsync(async (req: ExpRequest, res: ExpResponse) => {
  if (typeof req.params['userId'] === 'string') {
    await userService.deleteUserById(req.params['userId']);
    res.status(httpStatus.NO_CONTENT).send();
  }
});
