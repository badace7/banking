import { IEvent } from 'src/libs/domain/domain.ievent';

export interface IEventPort {
  save(transactionEvents: IEvent[], accountId: string): Promise<void>;
  getAll(streamName: string): Promise<IEvent[]>;
}
