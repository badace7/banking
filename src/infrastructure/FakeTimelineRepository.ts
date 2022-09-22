import { ITimelineRepository } from '../domain/timeline/interfaces/timeline.irepository';
import TimelineDomain from '../domain/timeline/Timeline.domain';

class FakeTimelineRepository implements ITimelineRepository {
  private datas;

  constructor(datas: TimelineDomain[] = []) {
    this.datas = datas;
  }

  async save(data: TimelineDomain): Promise<TimelineDomain> {
    await this.datas.push(data);
    return data;
  }

  async findTimeline(author: string): Promise<TimelineDomain> {
    return await this.datas.find((data) => data.getOwner === author);
  }
}

export default FakeTimelineRepository;
