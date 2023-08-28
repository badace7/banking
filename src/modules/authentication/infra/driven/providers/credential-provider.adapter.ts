import { ICredentialProvider } from '../../tests/create-user.spec';

export class CredentialProvider implements ICredentialProvider {
  generateIdentifier(): string {
    return Math.random().toString().substring(2, 13);
  }
  generatePassword(): string {
    return Math.random().toString().substring(2, 8);
  }
}
