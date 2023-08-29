import { ICookieProvider } from 'src/modules/authentication/application/_ports/repositories/cookie-provider.iport';

export class CookieProvider implements ICookieProvider {
  createCookieWithToken(token: string, expirationTime: string): string {
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${expirationTime}`;
  }

  clearCookie(): string {
    return 'Authentication=; HttpOnly; Path=/; Max-Age=0';
  }
}
