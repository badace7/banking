import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPostgresAdapter } from 'src/modules/authentication/adapters/secondary/postgres/user.postgres.adapter';
import {
  IJwtProvider,
  JWT_PROVIDER_PORT,
  JwtPayload,
} from 'src/modules/authentication/core/_ports/repositories/jwt-provider.iport';
import { USER_PORT } from 'src/modules/authentication/core/_ports/repositories/user.iport';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    @Inject(USER_PORT) private readonly userAdapter: UserPostgresAdapter,
    @Inject(JWT_PROVIDER_PORT) private readonly jwtProvider: IJwtProvider,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const refreshToken = await this.userAdapter.findUserRefreshToken(
      payload.id,
    );

    if (!refreshToken) {
      throw new UnauthorizedException('Access denied. Session expired');
    }

    const data = await this.jwtProvider.decodeToken(refreshToken);

    const user = await this.userAdapter.findById(data.id);

    const newAccessToken = this.jwtProvider.createAccessToken(
      { id: payload.id, role: payload.role },
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRATION_TIME,
    );

    return {
      id: user.data.id,
      identifier: user.data.identifier,
      firstName: user.data.firstName,
      lastName: user.data.lastName,
      role: user.data.role.data.role,
      accessToken: newAccessToken,
    };
  }
}
