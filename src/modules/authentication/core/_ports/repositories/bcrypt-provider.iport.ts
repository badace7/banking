export const BCRYPT_PROVIDER_PORT = 'IBcryptProvider';

export interface IBcryptProvider {
  hash(password: string): Promise<string>;
  compare(password: string, hashedPassword: string): Promise<boolean>;
}
