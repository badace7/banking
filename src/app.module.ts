import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { DatabaseModule } from './config/database.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { LoggingMiddleware } from './libs/middlewares/logging.middleware';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OperationModule } from './modules/operation/operation.module';
import { AccountModule } from './modules/account/account.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    DatabaseModule,
    AccountModule,
    AuthenticationModule,
    OperationModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
