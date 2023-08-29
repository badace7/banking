import { ICredentialProvider } from 'src/modules/authentication/application/_ports/repositories/credential-provider.iport';

export class CredentialProvider implements ICredentialProvider {
  generateIdentifier(): string {
    return Math.random().toString().substring(2, 13);
  }
  generatePassword(): string {
    return Math.random().toString().substring(2, 8);
  }
}
