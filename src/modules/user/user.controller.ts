import httpStatus from 'http-status';
import { Request as ExpRequest } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Middlewares,
  Patch,
  Path,
  Post,
  Queries,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';
import ApiError from '../errors/ApiError.js';
import pick from '../utils/pick.js';
import { IOptions, QueryResult } from '../paginate/paginate.js';
import * as userService from './user.service.js';
import { IApiError } from '../errors/error.js';
import auth from '../auth/auth.middleware.js';
import { IUserBaseModel, NewCreatedUser, UpdateUserBodyByAdmin } from './user.interfaces.js';
import { PERMISSIONS } from '../../config/roles.js';
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

  @Response<IApiError>(400, 'Validation failed.')
  @Response<IApiError>(401, 'Unauthorized')
  @Response<IApiError>(403, 'Forbidden')
  @SuccessResponse('200', 'Success')
  @Middlewares(validate(userValidation.getUsers))
  @Security('jwt') // just adds auth specs to openapi
  @Middlewares(auth(PERMISSIONS.getUsers)) // actually handles auth
  @Get()
  public async getUsers(
    @Queries() queries: { name?: string; role?: string; sortBy?: string; projectBy?: string; limit?: number; page?: number }
  ): Promise<QueryResult<IUserBaseModel>> {
    const filter = pick(queries, ['name', 'role']);
    const options: IOptions = pick(queries, ['sortBy', 'limit', 'page', 'projectBy']);
    const result = await userService.queryUsers(filter, options);
    return result;
  }

  @Response<IApiError>(400, 'Validation failed.')
  @Response<IApiError>(401, 'Unauthorized')
  @Response<IApiError>(403, 'Forbidden')
  @Response<IApiError>(422, 'Unprocessable entity.')
  @SuccessResponse('200', 'Success.')
  @Middlewares(validate(userValidation.updateUser))
  @Security('jwt') // just adds auth specs to openapi
  @Middlewares(auth(PERMISSIONS.manageUsers)) // actually handles auth
  @Patch('{userId}')
  public async updateUser(
    @Path() userId: string,
    @Body() requestBody: UpdateUserBodyByAdmin
  ): Promise<IUserBaseModel | null> {
    const user = await userService.updateUserById(userId, requestBody);
    return user;
  }

  @Response<IApiError>(400, 'Validation failed.')
  @Response<IApiError>(401, 'Unauthorized')
  @Response<IApiError>(403, 'Forbidden')
  @Response<IApiError>(404, 'Not Found')
  @SuccessResponse('204', 'Success.')
  @Middlewares(validate(userValidation.deleteUser))
  @Security('jwt') // just adds auth specs to openapi
  @Middlewares(auth(PERMISSIONS.manageUsers)) // actually handles auth
  @Delete('{userId}')
  public async deleteUser(@Path() userId: string): Promise<void> {
    await userService.deleteUserById(userId);
  }
}
