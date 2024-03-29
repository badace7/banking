import { Test, TestingModule } from '@nestjs/testing';

import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RoleEnum } from '../core/domain/user';
import { NotValidException } from 'src/libs/exceptions/usecase.error';
import { JwtProvider } from '../adapters/secondary/providers/jwt-provider.adapter';

describe('jwt-provider adapter', () => {
  let provider: JwtProvider;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: {
              expiresIn: configService.get<string>('JWT_EXPIRATION_TIME'),
            },
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [JwtProvider, JwtService, ConfigService],
    }).compile();

    provider = module.get<JwtProvider>(JwtProvider);
    configService = module.get<ConfigService>(ConfigService);
  });

  test('createToken() should create a token', () => {
    //Arrange
    const payload = { id: '1', role: RoleEnum.CUSTOMER };
    const secret = configService.get<string>('JWT_SECRET');
    const expiresIn = configService.get<string>('JWT_EXPIRATION_TIME');

    //Act
    const token = provider.createAccessToken(payload, secret, expiresIn);

    //Assert
    expect(typeof token).toBe('string');
    expect(token).toHaveLength(152);
  });

  test('checkToken() should verify a token', async () => {
    //Arrange
    const payload = { id: '1', role: RoleEnum.CUSTOMER };
    const secret = configService.get<string>('JWT_SECRET');
    const expiresIn = configService.get<string>('JWT_EXPIRATION_TIME') + 's';

    //Act
    const token = provider.createAccessToken(payload, secret, expiresIn);

    //Assert
    const verifiedPayload = await provider.checkToken(token);
    expect(verifiedPayload).toMatchObject(payload);
  });

  test('checkToken() should throw an error for an invalid token', async () => {
    //Arrange
    const invalidToken = 'invalid-token';

    //Act
    const tryInvalidToken = () => provider.checkToken(invalidToken);

    //Assert
    await expect(tryInvalidToken).rejects.toThrow(NotValidException);
  });
});
