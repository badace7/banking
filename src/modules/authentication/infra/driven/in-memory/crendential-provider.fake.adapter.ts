import { ICredentialProvider } from '../../../application/_ports/repositories/credential-provider.iport';

export class FakeCredientialProvider implements ICredentialProvider {
  generateIdentifier(): any {
    return '12312312312';
  }
  generatePassword(): any {
    return '123123';
  }
}
