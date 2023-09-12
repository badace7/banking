export type JwtPayload = {
  id: string;
  role: number;
};

export const JWT_PROVIDER_PORT = 'IJwtProvider';
export interface IJwtProvider {
  getJwtSecret(): string;
  getJwtExpirationTime(): string;
  checkToken(token: string): Promise<any>;
  createAccessToken(
    payload: JwtPayload,
    secret: string,
    expiresIn: string,
  ): string;
  createRefreshToken(payload: JwtPayload, secret: string): string;
}
