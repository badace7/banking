export const COOKIE_PROVIDER_PORT = 'ICookieProvider';

export interface ICookieProvider {
  createCookieWithToken(token: string, expirationTime: string): string;
  clearCookie(): string;
}
