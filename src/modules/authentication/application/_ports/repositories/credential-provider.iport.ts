export const CREDENTIAL_PROVIDER_PORT = 'ICredentialProvider';

export interface ICredentialProvider {
  generateIdentifier(): string;
  generatePassword(): string;
}
