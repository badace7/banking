export interface ICredentialProvider {
  generateIdentifier(): string;
  generatePassword(): string;
}
