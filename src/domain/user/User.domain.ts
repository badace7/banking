class UserDomain {
  private name: string;
  private followedUser: string[];

  constructor({ name }: { name: string }) {
    this.name = name;
  }

  public get getName(): string {
    return this.name;
  }
  public set setName(newName: string) {
    this.name = newName;
  }

  public get getFollowedUser(): string[] {
    return this.followedUser;
  }
  public set setFollowedUser(newFollowedUser: string[]) {
    this.followedUser = newFollowedUser;
  }

  public addFollowedUser(user: string) {
    this.followedUser.push(user);
  }
}

export default UserDomain;
