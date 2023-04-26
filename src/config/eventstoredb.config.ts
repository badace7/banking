import { Global, Module } from '@nestjs/common';
import { EventStoreDBClient } from '@eventstore/db-client';

const EventStore = {
  provide: EventStoreDBClient,
  useFactory: () =>
    EventStoreDBClient.connectionString(process.env.EVENT_STORE),
};

@Global()
@Module({
  providers: [EventStore],
  exports: [EventStore],
})
export class EventStoreModule {}
