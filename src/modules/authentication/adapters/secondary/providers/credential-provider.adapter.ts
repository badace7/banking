import { ICredentialProvider } from 'src/modules/authentication/core/_ports/repositories/credential-provider.iport';

export class CredentialProvider implements ICredentialProvider {
  async generateIdentifier(): Promise<string> {
    return await Math.random().toString().substring(2, 13);
  }
  async generatePassword(): Promise<string> {
    return await Math.random().toString().substring(2, 8);
  }
}
