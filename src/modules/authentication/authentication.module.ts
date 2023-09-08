import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationController } from './infra/driver/authentication.controller';
import { Module } from '@nestjs/common';
import { UserPostgresAdapter } from './infra/driven/postgres/user.postgres.adapter';
import { USER_PORT } from './application/_ports/repositories/user.iport';
import { JWT_PROVIDER_PORT } from './application/_ports/repositories/jwt-provider.iport';
import { JwtProvider } from './infra/driven/providers/jwt-provider.adapter';
import { CREDENTIAL_PROVIDER_PORT } from './application/_ports/repositories/credential-provider.iport';
import { CredentialProvider } from './infra/driven/providers/credential-provider.adapter';
import { COOKIE_PROVIDER_PORT } from './application/_ports/repositories/cookie-provider.iport';
import { CookieProvider } from './infra/driven/providers/cookie-provider.adapter';
import { BCRYPT_PROVIDER_PORT } from './application/_ports/repositories/bcrypt-provider.iport';
import { BcryptProvider } from './infra/driven/providers/bcrypt-provider.adapter';
import { LOGIN_PORT } from './application/_ports/usecases/login.iport';
import { Login } from './application/usecases/login.usecase';
import { CREATE_USER_PORT } from './application/_ports/usecases/create-user.iport';
import { CreateUser } from './application/usecases/create-user.usecase';
import { UserEntity } from './infra/driven/entities/user.entity';
import { RoleEntity } from './infra/driven/entities/role.entity';

import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/libs/strategies/jwt.strategy';
import { createInjectableProvider } from '../shared/provider.factory';

export const respositories = [
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
  createInjectableProvider(CREATE_USER_PORT, CreateUser, [
    USER_PORT,
    BCRYPT_PROVIDER_PORT,
    CREDENTIAL_PROVIDER_PORT,
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
  providers: [...usecases, ...respositories, JwtStrategy],
  exports: [...usecases, ...respositories, TypeOrmModule],
})
export class AuthenticationModule {}
