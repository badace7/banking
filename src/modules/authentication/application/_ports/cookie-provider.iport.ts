export interface ICookieProvider {
  createCookieWithToken(token: string, expirationTime: string): string;
  clearCookie(): string;
}
