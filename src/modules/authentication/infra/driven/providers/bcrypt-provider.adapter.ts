import { hash, compare } from 'bcrypt';
import { IBcryptProvider } from 'src/modules/authentication/application/_ports/bcrypt-provider.iport';

export class BcryptProvider implements IBcryptProvider {
  private rounds = 12;
  async hash(password: string) {
    return await hash(password, this.rounds);
  }
  async compare(password: string, hashedPassword: string) {
    return await compare(password, hashedPassword);
  }
}
