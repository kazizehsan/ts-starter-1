import httpStatus from 'http-status';
import { Request as ExpRequest, Response as ExpResponse } from 'express';
import catchAsync from '../utils/catchAsync.js';
import ApiError from '../errors/ApiError.js';
import pick from '../utils/pick.js';
import { IOptions } from '../paginate/paginate.js';
import * as userService from './user.service.js';
import { Controller, Get, Middlewares, Request, Response, Route, SuccessResponse } from 'tsoa';
import { IApiError } from '../errors/error.js';
import auth from './../auth/auth.middleware.js';
import { IUserBaseModel } from './user.interfaces.js';
import { PERMISSIONS } from './../../config/roles.js';

@Route('v1/users')
export class UserController extends Controller {
  @Response<IApiError>(401, 'Unauthorized')
  @SuccessResponse('200', 'Success')
  @Get('me')
  @Middlewares(auth())
  public async getMe(@Request() req: ExpRequest): Promise<IUserBaseModel> {
    const user = await userService.getUserById(req.user.id);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    return user;
  }

  @Response<IApiError>(401, 'Unauthorized')
  @Response<IApiError>(403, 'Forbidden')
  @SuccessResponse('200', 'Success')
  @Get('{userId}')
  @Middlewares(auth(PERMISSIONS.getUsers))
  public async getUser(userId: string): Promise<IUserBaseModel> {
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
