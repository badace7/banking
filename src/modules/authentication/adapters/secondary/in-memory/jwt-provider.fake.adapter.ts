import {
  IJwtProvider,
  JwtPayload,
} from 'src/modules/authentication/core/_ports/repositories/jwt-provider.iport';

export class FakeJwtProvider implements IJwtProvider {
  getJwtSecret(): string {
    return 'testing-secret';
  }
  getJwtExpirationTime(): string {
    return '1800';
  }
  createAccessToken(
    payload: JwtPayload,
    secret: string,
    expiresIn: string,
  ): string {
    return 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiMSIsImlkIjoiYWJjIiwiaWF0IjoiMTUxNjIzOTAyMiJ9.mlW6UWzJLZO-KSDo4DYfwlUTUspRhgfT75QX88K_lZA';
  }

  decodeToken(token: string) {
    throw new Error('Method not implemented.');
  }
  createRefreshToken(payload: JwtPayload, secret: string): string {
    throw new Error('Method not implemented.');
  }
  checkToken(token: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
