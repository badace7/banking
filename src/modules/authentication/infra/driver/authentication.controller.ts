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
} from '../../application/_ports/usecases/create-user.iport';
import {
  ILogin,
  LOGIN_PORT,
} from '../../application/_ports/usecases/login.iport';
import { LoginRequest } from '../../application/usecases/login.request';
import { CreateUserRequest } from '../../application/usecases/create-user.request';

@Controller('auth')
export class AuthenticationController {
  constructor(
    @Inject(CREATE_USER_PORT) private readonly createUserUsecase: ICreateUser,
    @Inject(LOGIN_PORT) private readonly loginUsecase: ILogin,
  ) {}

  @Post('login')
  async login(@Body() body: any, @Res() response: Response) {
    try {
      const command = new LoginRequest(body.identifier, body.password);
      const token = await this.loginUsecase.execute(command);
      response.setHeader('set-cookie', token);
      response.status(HttpStatus.OK).send('Login successful');
    } catch (err: any) {
      response.status(HttpStatus.UNAUTHORIZED).send(err.message);
    }
  }

  @Post('create-user')
  async createUser(@Body() body: any, @Res() response: Response) {
    try {
      const command = new CreateUserRequest(
        uuidv4(),
        body.firstName,
        body.lastName,
      );
      const credentials = await this.createUserUsecase.execute(command);
      response.status(HttpStatus.CREATED).send(credentials.data);
    } catch (err: any) {
      console.log(err);

      response.status(HttpStatus.CONFLICT).send(err.message);
    }
  }

  @Post('logout')
  async logout(@Res() response: Response) {
    response.clearCookie('Authentication');
    response.status(HttpStatus.OK).send('Logout successful');
  }
}
