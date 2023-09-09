import { Login } from '../core/usecases/login.usecase';

import { IJwtProvider } from '../core/_ports/repositories/jwt-provider.iport';
import { User } from '../core/domain/user';
import {
  NotFoundException,
  NotValidException,
} from 'src/libs/exceptions/usecase.error';
import { IUserPort } from '../core/_ports/repositories/user.iport';
import { ICookieProvider } from '../core/_ports/repositories/cookie-provider.iport';
import { IBcryptProvider } from '../core/_ports/repositories/bcrypt-provider.iport';
import { LoginRequest } from '../core/usecases/login.request';

import { Role } from '../core/domain/role';
import { InMemoryUserAdapter } from '../adapters/secondary/in-memory/in-memory-user.adapter';
import { FakeJwtProvider } from '../adapters/secondary/in-memory/jwt-provider.fake.adapter';
import { BcryptProvider } from '../adapters/secondary/providers/bcrypt-provider.adapter';
import { CookieProvider } from '../adapters/secondary/providers/cookie-provider.adapter';

describe('Feature: user', () => {
  let userRepository: IUserPort;
  let bcryptProvider: IBcryptProvider;
  let jwtProvider: IJwtProvider;
  let cookieProvider: ICookieProvider;
  let loginUsecase: Login;

  beforeEach(async () => {
    userRepository = new InMemoryUserAdapter();
    bcryptProvider = new BcryptProvider();
    jwtProvider = new FakeJwtProvider();
    cookieProvider = new CookieProvider();
    loginUsecase = new Login(
      userRepository,
      bcryptProvider,
      jwtProvider,
      cookieProvider,
    );
  });

  describe('Rule: login is not authorized', () => {
    it('should return "User not found"', async () => {
      //Arrange
      const credentials = new LoginRequest('12312312312', '123123');
      //Act
      const tryToLogin = () => loginUsecase.execute(credentials);
      //Assert
      await expect(tryToLogin).rejects.toThrowError(NotFoundException);
    });

    it('should return "Invalid password"', async () => {
      //Arrange
      const password = await bcryptProvider.hash('123123');
      userRepository.save(
        new User(
          'abc',
          '12312312312',
          password,
          'Jack',
          'Sparrow',
          new Role(1, 'CUSTOMER'),
        ),
      );
      const credentials = new LoginRequest('12312312312', '456456');

      //Act
      const tryToLogin = () => loginUsecase.execute(credentials);

      //Assert
      await expect(tryToLogin).rejects.toThrowError(NotValidException);
    });
  });

  describe('Rule: login is authorized', () => {
    it('should return a cookie with valid token', async () => {
      //Arrange
      const password = await bcryptProvider.hash('123123');
      userRepository.save(
        new User(
          'abc',
          '12312312312',
          password,
          'Jack',
          'Sparrow',
          new Role(1, 'CUSTOMER'),
        ),
      );
      const credentials = new LoginRequest('12312312312', '123123');

      //Act
      const expectedCookie = await loginUsecase.execute(credentials);

      //Assert
      const token =
        'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiMSIsImlkIjoiYWJjIiwiaWF0IjoiMTUxNjIzOTAyMiJ9.mlW6UWzJLZO-KSDo4DYfwlUTUspRhgfT75QX88K_lZA';
      const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=1800s`;
      expect(expectedCookie).toEqual(cookie);
    });
  });
});
