import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  CREATE_USER_PORT,
  ICreateUser,
} from '../../core/_ports/usecases/create-user.iport';
import { ILogin, LOGIN_PORT } from '../../core/_ports/usecases/login.iport';
import { LoginRequest } from '../../core/usecases/login.request';
import { CreateUserRequest } from '../../core/usecases/create-user.request';
import { LoginDTO } from './login.dto';
import { CreateUserDTO } from './create-user.dto';
import { Auth } from './authentication.routes';

@Controller(Auth.ROOT)
export class AuthenticationController {
  constructor(
    @Inject(CREATE_USER_PORT) private readonly createUserUsecase: ICreateUser,
    @Inject(LOGIN_PORT) private readonly loginUsecase: ILogin,
  ) {}

  @Post(Auth.LOGIN)
  async login(@Body() body: LoginDTO, @Res() response: Response) {
    try {
      const command = new LoginRequest(body.identifier, body.password);
      const cookie = await this.loginUsecase.execute(command);
      response.setHeader('set-cookie', cookie);
      response.status(HttpStatus.OK).send('Login successful');
    } catch (err: any) {
      response.status(HttpStatus.UNAUTHORIZED).send(err.message);
    }
  }

  @Post(Auth.CREATE_USER)
  async createUser(@Body() body: CreateUserDTO, @Res() response: Response) {
    try {
      const command = new CreateUserRequest(
        uuidv4(),
        body.firstName,
        body.lastName,
      );
      const credentials = await this.createUserUsecase.execute(command);
      response.status(HttpStatus.CREATED).send(credentials.data);
    } catch (err: any) {
      response.status(HttpStatus.CONFLICT).send(err.message);
    }
  }

  @Post(Auth.LOGOUT)
  async logout(@Res() response: Response) {
    response.clearCookie('Authentication');
    response.status(HttpStatus.OK).send('Logout successful');
  }
}
