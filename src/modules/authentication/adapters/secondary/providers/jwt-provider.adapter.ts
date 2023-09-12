import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NotValidException } from 'src/libs/exceptions/usecase.error';
import {
  IJwtProvider,
  JwtPayload,
} from 'src/modules/authentication/core/_ports/repositories/jwt-provider.iport';

@Injectable()
export class JwtProvider implements IJwtProvider {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }
  getJwtExpirationTime(): string {
    return this.configService.get<string>('JWT_EXPIRATION_TIME');
  }
  async checkToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.getJwtSecret(),
      });
    } catch (error) {
      throw new NotValidException('Token is not valid');
    }
  }
  createAccessToken(
    payload: JwtPayload,
    secret: string,
    expiresIn: string,
  ): string {
    return this.jwtService.sign(payload, { secret, expiresIn });
  }

  createRefreshToken(payload: JwtPayload, secret: string): string {
    return this.jwtService.sign(payload, { secret, expiresIn: '1800s' });
  }
}
