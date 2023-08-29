import {
  NotFoundException,
  NotValidException,
} from 'src/libs/exceptions/usecase.error';
import { ICookieProvider } from '../_ports/repositories/cookie-provider.iport';
import {
  IJwtProvider,
  JwtPayload,
} from '../_ports/repositories/jwt-provider.iport';
import { IBcryptProvider } from '../_ports/repositories/bcrypt-provider.iport';
import { IUserPort } from '../_ports/repositories/user.iport';
import { ILogin } from '../_ports/usecases/login.iport';
import { LoginRequest } from './login.request';

export class Login implements ILogin {
  constructor(
    private readonly userRepository: IUserPort,
    private readonly bcryptAdapter: IBcryptProvider,
    private readonly jwtProvider: IJwtProvider,
    private readonly cookieProvider: ICookieProvider,
  ) {}
  async execute(request: LoginRequest): Promise<string> {
    const user = await this.userRepository.findByIdentifier(request.identifier);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await this.bcryptAdapter.compare(
      request.password,
      user.data.password,
    );

    if (!isValid) {
      throw new NotValidException('Invalid password');
    }

    const payload: JwtPayload = {
      id: user.data.id,
      role: user.data.role,
    };

    const secret = this.jwtProvider.getJwtSecret();
    const expiresIn = this.jwtProvider.getJwtExpirationTime() + 's';

    const token = this.jwtProvider.createToken(payload, secret, expiresIn);

    return await this.cookieProvider.createCookieWithToken(token, expiresIn);
  }
}
