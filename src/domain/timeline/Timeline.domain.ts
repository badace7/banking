import MessageDomain from '../message/Message.domain';
import UserDomain from '../user/User.domain';

class TimelineDomain {
  private owner: string;
  private messages: MessageDomain[];
  private followers: UserDomain[];

  constructor({
    owner,
    messages = [],
  }: {
    owner: string;
    messages?: MessageDomain[];
  }) {
    this.owner = owner;
    this.messages = messages;
  }

  public get getOwner(): string {
    return this.owner;
  }
  public set setOwner(newOwner: string) {
    this.owner = newOwner;
  }
  public get getMessages(): MessageDomain[] {
    return this.messages;
  }
  public set setMessages(newMessages: MessageDomain[]) {
    this.messages = newMessages;
  }

  public get getFollowers(): UserDomain[] {
    return this.followers;
  }
  public set setFollowers(newFollowers: UserDomain[]) {
    this.followers = newFollowers;
  }

  public addMessageToTimeline(message: MessageDomain) {
    this.messages.push(message);
  }

  public addFollowersToTimeline(follower: UserDomain) {
    this.followers.push(follower);
  }
}

export default TimelineDomain;
