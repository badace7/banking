export class UsecaseError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
  }
}
