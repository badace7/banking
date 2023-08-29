import { hash, compare } from 'bcrypt';
import { IBcryptProvider } from 'src/modules/authentication/application/_ports/repositories/bcrypt-provider.iport';

export class BcryptProvider implements IBcryptProvider {
  private readonly ROUNDS = 12;
  async hash(password: string) {
    return await hash(password, this.ROUNDS);
  }
  async compare(password: string, hashedPassword: string) {
    return await compare(password, hashedPassword);
  }
}
