import {
  NotFoundException,
  NotValidException,
} from 'src/libs/exceptions/usecase.error';
import { ICookieProvider } from '../_ports/cookie-provider.iport';
import { IJwtProvider, JwtPayload } from '../_ports/jwt-provider.iport';
import { IBcryptProvider } from '../_ports/bcrypt-provider.iport';
import { IUserPort } from '../_ports/user.iport';

export class Login {
  constructor(
    private readonly userRepository: IUserPort,
    private readonly bcryptAdapter: IBcryptProvider,
    private readonly jwtProvider: IJwtProvider,
    private readonly cookieProvider: ICookieProvider,
  ) {}
  async execute(command: {
    identifier: string;
    password: string;
  }): Promise<string> {
    const user = await this.userRepository.findByIdentifier(command.identifier);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await this.bcryptAdapter.compare(
      command.password,
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
