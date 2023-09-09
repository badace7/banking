import {
  IJwtProvider,
  JwtPayload,
} from 'src/modules/authentication/core/_ports/repositories/jwt-provider.iport';

export class FakeJwtProvider implements IJwtProvider {
  checkToken(token: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  getJwtSecret(): string {
    return 'testing-secret';
  }
  getJwtExpirationTime(): string {
    return '1800';
  }
  createToken(payload: JwtPayload, secret: string, expiresIn: string): string {
    return 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiMSIsImlkIjoiYWJjIiwiaWF0IjoiMTUxNjIzOTAyMiJ9.mlW6UWzJLZO-KSDo4DYfwlUTUspRhgfT75QX88K_lZA';
  }
}
