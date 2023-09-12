import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { USER_PORT } from 'src/modules/authentication/core/_ports/repositories/user.iport';
import { JwtPayload } from 'src/modules/authentication/core/_ports/repositories/jwt-provider.iport';
import { UserPostgresAdapter } from 'src/modules/authentication/adapters/secondary/postgres/user.postgres.adapter';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USER_PORT) private readonly userAdapter: UserPostgresAdapter,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const userAccountNumber = await this.userAdapter.findAccountNumberByUserId(
      payload.id,
    );
    return {
      id: payload.id,
      role: payload.role,
      accountNumber: userAccountNumber,
    };
  }
}
