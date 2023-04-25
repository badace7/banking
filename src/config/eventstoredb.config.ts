import { Global, Module } from '@nestjs/common';
import { EventStoreDBClient } from '@eventstore/db-client';

const EventStore = {
  provide: EventStoreDBClient,
  useFactory: () =>
    EventStoreDBClient.connectionString('esdb://172.22.0.3:2113?tls=false'),
};

@Global()
@Module({
  providers: [EventStore],
  exports: [EventStore],
})
export class EventStoreModule {}
