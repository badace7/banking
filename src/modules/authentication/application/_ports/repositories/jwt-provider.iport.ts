export type JwtPayload = {
  id: string;
  role: number;
};

export const JWT_PROVIDER_PORT = 'IJwtProvider';
//TODO DELETE checkToken(), decodeToken()
export interface IJwtProvider {
  getJwtSecret(): string;
  getJwtExpirationTime(): string;
  checkToken(token: string): Promise<any>;
  createToken(payload: JwtPayload, secret: string, expiresIn: string): string;
  decodeToken(token: string): JwtPayload;
}
