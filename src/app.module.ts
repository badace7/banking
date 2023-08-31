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

@Module({
  imports: [DatabaseModule, BankingModule, AuthenticationModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
