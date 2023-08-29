import { ICredentialProvider } from '../../../application/_ports/repositories/credential-provider.iport';

export class FakeCredientialProvider implements ICredentialProvider {
  generateIdentifier(): string {
    return '12312312312';
  }
  generatePassword(): string {
    return '123123';
  }
}
