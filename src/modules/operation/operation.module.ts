import { Module } from '@nestjs/common';
import { CreateOperationWhenDepositIsDone } from './create-operation-when-deposit-is-done.usecase';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  providers: [CreateOperationWhenDepositIsDone],
  imports: [EventEmitterModule],
})
export class OperationModule {}
