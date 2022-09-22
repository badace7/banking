import { Inject, Injectable } from '@nestjs/common';
import MessageDomain from '../message/Message.domain';
import { ITimelineRepository } from './interfaces/timeline.irepository';
import { ITimelineService } from './interfaces/timeline.iservice';
import TimelineDomain from './Timeline.domain';
import UserDomain from '../user/User.domain';

@Injectable()
export class TimelineService implements ITimelineService {
  private repository: ITimelineRepository;
  constructor(@Inject('IPostingRepository') repository: ITimelineRepository) {
    this.repository = repository;
  }

  async postAmessageOnAtimeline(message: MessageDomain): Promise<any> {
    let timeline = await this.repository.findTimeline(message.getAuthor);

    if (!timeline) {
      timeline = new TimelineDomain({ owner: message.getAuthor });
    }

    timeline.addMessageToTimeline(message);

    return await this.repository.save(timeline);
  }

  async getUserTimeline(author: string): Promise<TimelineDomain> {
    return await this.repository.findTimeline(author);
  }

  async subscribeToATimeLine(
    user: UserDomain,
    author: string,
  ): Promise<string> {
    const timeline = await this.repository.findTimeline(author);

    if (!timeline) {
      new Error('Timeline not found.');
    }

    timeline.addFollowersToTimeline(user);

    console.log(timeline);

    this.repository.save(timeline);

    return `${author} followed successfully.`;
  }
}
