class MessageDomain {
  private author: string;
  private message: string;

  constructor({ author, message }: { author: string; message?: string }) {
    this.author = author;
    this.message = message;
  }

  public get getAuthor(): string {
    return this.author;
  }
  public set setAuthor(newAuthor: string) {
    this.author = newAuthor;
  }
  public get getMessage(): string {
    return this.message;
  }
  public set setMessage(newMessage: string) {
    this.message = newMessage;
  }
}

export default MessageDomain;
