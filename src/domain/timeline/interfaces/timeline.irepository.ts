import TimelineDomain from '../Timeline.domain';

export interface ITimelineRepository {
  save(timeline: TimelineDomain): Promise<TimelineDomain>;
  findTimeline(author: string): Promise<TimelineDomain>;
}
