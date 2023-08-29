export const CREDENTIAL_PROVIDER_PORT = 'ICredentialProvider';

export interface ICredentialProvider {
  generateIdentifier(): Promise<string>;
  generatePassword(): Promise<string>;
}
