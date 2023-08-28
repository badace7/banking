import { ICredentialProvider } from '../../../application/_ports/credential-provider.iport';

export class FakeCredientialProvider implements ICredentialProvider {
  generateIdentifier(): string {
    return '12312312312';
  }
  generatePassword(): string {
    return '123123';
  }
}
