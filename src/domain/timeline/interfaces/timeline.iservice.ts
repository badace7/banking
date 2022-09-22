import MessageDomain from '../../message/Message.domain';
import TimelineDomain from '../Timeline.domain';
import UserDomain from '../../user/User.domain';

export interface ITimelineService {
  postAmessageOnAtimeline(message: MessageDomain): Promise<MessageDomain>;
  getUserTimeline(author: string): Promise<TimelineDomain>;
  subscribeToATimeLine(user: UserDomain, author: string): Promise<string>;
}
