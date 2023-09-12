import { TypeOrmModule } from '@nestjs/typeorm';

import { Module } from '@nestjs/common';

import { USER_PORT } from './core/_ports/repositories/user.iport';
import { JWT_PROVIDER_PORT } from './core/_ports/repositories/jwt-provider.iport';

import { CREDENTIAL_PROVIDER_PORT } from './core/_ports/repositories/credential-provider.iport';

import { COOKIE_PROVIDER_PORT } from './core/_ports/repositories/cookie-provider.iport';

import { BCRYPT_PROVIDER_PORT } from './core/_ports/repositories/bcrypt-provider.iport';

import { LOGIN_PORT } from './core/_ports/usecases/login.iport';
import { Login } from './core/usecases/login.usecase';
import { CREATE_USER_PORT } from './core/_ports/usecases/create-user.iport';
import { CreateUser } from './core/usecases/create-user.usecase';

import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/libs/strategies/jwt.strategy';
import { createInjectableProvider } from '../shared/provider.factory';
import { ConfigService } from '@nestjs/config';
import { AuthenticationController } from './adapters/primary/authentication.controller';
import { RoleEntity } from './adapters/secondary/entities/role.entity';
import { UserEntity } from './adapters/secondary/entities/user.entity';
import { UserPostgresAdapter } from './adapters/secondary/postgres/user.postgres.adapter';
import { BcryptProvider } from './adapters/secondary/providers/bcrypt-provider.adapter';
import { CookieProvider } from './adapters/secondary/providers/cookie-provider.adapter';
import { CredentialProvider } from './adapters/secondary/providers/credential-provider.adapter';
import { JwtProvider } from './adapters/secondary/providers/jwt-provider.adapter';
import { EVENT_PUBLISHER_PORT } from './core/_ports/repositories/event-publisher.iport';
import { EventPublisher } from '../shared/event-publisher';
import { LOGOUT_PORT } from './core/_ports/usecases/logout.iport';
import { Logout } from './core/usecases/logout.usecase';

export const respositories = [
  {
    provide: EVENT_PUBLISHER_PORT,
    useClass: EventPublisher,
  },
  {
    provide: USER_PORT,
    useClass: UserPostgresAdapter,
  },
  {
    provide: JWT_PROVIDER_PORT,
    useClass: JwtProvider,
  },
  {
    provide: CREDENTIAL_PROVIDER_PORT,
    useClass: CredentialProvider,
  },
  {
    provide: COOKIE_PROVIDER_PORT,
    useClass: CookieProvider,
  },
  {
    provide: BCRYPT_PROVIDER_PORT,
    useClass: BcryptProvider,
  },
];

export const usecases = [
  createInjectableProvider(LOGIN_PORT, Login, [
    USER_PORT,
    BCRYPT_PROVIDER_PORT,
    JWT_PROVIDER_PORT,
    COOKIE_PROVIDER_PORT,
  ]),

  createInjectableProvider(LOGOUT_PORT, Logout, [USER_PORT]),
  createInjectableProvider(CREATE_USER_PORT, CreateUser, [
    USER_PORT,
    BCRYPT_PROVIDER_PORT,
    CREDENTIAL_PROVIDER_PORT,
    EVENT_PUBLISHER_PORT,
  ]),
];

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoleEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [...usecases, ...respositories, JwtStrategy, ConfigService],
  exports: [...usecases, ...respositories, TypeOrmModule],
})
export class AuthenticationModule {}
