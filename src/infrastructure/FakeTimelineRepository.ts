import { ITimelineRepository } from '../domain/timeline/interfaces/timeline.irepository';

class FakeTimelineRepository implements ITimelineRepository {
  private datas;

  constructor(datas: any[] = []) {
    this.datas = datas;
  }

  async save(data: any): Promise<any> {
    await this.datas.push(data);
    return data;
  }

  async findTimeline(author: string): Promise<any> {
    return await this.datas.find((data) => data.getOwner === author);
  }
}

export default FakeTimelineRepository;
