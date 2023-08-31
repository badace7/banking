import * as bcrypt from 'bcryptjs';
import { IBcryptProvider } from 'src/modules/authentication/application/_ports/repositories/bcrypt-provider.iport';

export class BcryptProvider implements IBcryptProvider {
  private readonly ROUNDS = 12;
  async hash(password: string) {
    const salt = await bcrypt.genSalt(this.ROUNDS);
    return await bcrypt.hash(password, salt);
  }
  async compare(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
