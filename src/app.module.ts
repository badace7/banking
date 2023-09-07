import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { BankingModule } from './modules/banking/banking.module';
import { DatabaseModule } from './config/database.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { LoggingMiddleware } from './libs/middlewares/logging.middleware';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OperationModule } from './modules/operation/operation.module';

@Module({
  imports: [
    DatabaseModule,
    BankingModule,
    AuthenticationModule,
    OperationModule,
    EventEmitterModule.forRoot(),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
