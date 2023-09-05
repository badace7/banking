import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UserPostgresAdapter } from 'src/modules/authentication/infra/driven/postgres/user.postgres.adapter';
import { USER_PORT } from 'src/modules/authentication/application/_ports/repositories/user.iport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USER_PORT) private readonly userAdapter: UserPostgresAdapter,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
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
