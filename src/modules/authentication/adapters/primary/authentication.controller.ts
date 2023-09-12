import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
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
import { ILogout, LOGOUT_PORT } from '../../core/_ports/usecases/logout.iport';
import { LogoutRequest } from '../../core/usecases/logout.request';
import { JwtAuthGuard } from 'src/libs/guards/jwt.guard';
import { JwtPayload } from '../../core/_ports/repositories/jwt-provider.iport';

@Controller(Auth.ROOT)
export class AuthenticationController {
  constructor(
    @Inject(CREATE_USER_PORT) private readonly createUserUsecase: ICreateUser,
    @Inject(LOGIN_PORT) private readonly loginUsecase: ILogin,
    @Inject(LOGOUT_PORT) private readonly logoutUsecase: ILogout,
  ) {}

  @Post(Auth.LOGIN)
  async login(@Body() body: LoginDTO, @Res() response: Response) {
    try {
      const request = new LoginRequest(body.identifier, body.password);
      const result = await this.loginUsecase.execute(request);

      response.status(HttpStatus.OK).send(result);
    } catch (err: any) {
      response.status(HttpStatus.UNAUTHORIZED).send(err.message);
    }
  }

  @Post(Auth.CREATE_USER)
  async createUser(@Body() body: CreateUserDTO, @Res() response: Response) {
    try {
      const request = new CreateUserRequest(
        uuidv4(),
        body.firstName,
        body.lastName,
      );
      const credentials = await this.createUserUsecase.execute(request);
      response.status(HttpStatus.CREATED).send(credentials.data);
    } catch (err: any) {
      response.status(HttpStatus.CONFLICT).send(err.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  // @Roles(RoleEnum.CUSTOMER)
  @Post(Auth.LOGOUT)
  async logout(@Req() req: Request) {
    const { id } = req.user as JwtPayload;
    const request = new LogoutRequest(id);
    console.log(request);
    await this.logoutUsecase.execute(request);
  }
}
