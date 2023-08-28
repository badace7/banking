export type JwtPayload = {
  id: string;
  role: number;
};

export interface IJwtProvider {
  getJwtSecret(): string;
  getJwtExpirationTime(): string;
  checkToken(token: string): Promise<any>;
  createToken(payload: JwtPayload, secret: string, expiresIn: string): string;
  decodeToken(token: string): JwtPayload;
}
