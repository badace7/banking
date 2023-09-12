import {
  NotFoundException,
  NotValidException,
} from 'src/libs/exceptions/usecase.error';
import {
  IJwtProvider,
  JwtPayload,
} from '../_ports/repositories/jwt-provider.iport';
import { IBcryptProvider } from '../_ports/repositories/bcrypt-provider.iport';
import { IUserPort } from '../_ports/repositories/user.iport';
import { ILogin } from '../_ports/usecases/login.iport';
import { LoginRequest } from './login.request';
import { LoginResult } from './login.result';

export class Login implements ILogin {
  constructor(
    private readonly userRepository: IUserPort,
    private readonly bcryptAdapter: IBcryptProvider,
    private readonly jwtProvider: IJwtProvider,
  ) {}

  async execute(request: LoginRequest): Promise<LoginResult> {
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
      role: user.data.role.data.id,
    };

    const secret = this.jwtProvider.getJwtSecret();
    const expiresIn = this.jwtProvider.getJwtExpirationTime() + 's';

    const accessToken = this.jwtProvider.createAccessToken(
      payload,
      secret,
      expiresIn,
    );

    const refreshToken = this.jwtProvider.createRefreshToken(payload, secret);

    await this.userRepository.updateRefreshToken(payload.id, refreshToken);

    return new LoginResult(
      user.data.id,
      user.data.identifier,
      user.data.firstName,
      user.data.lastName,
      user.data.role.data.role,
      accessToken,
    );
  }
}
