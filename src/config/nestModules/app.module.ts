import { Module } from '@nestjs/common';
import { AccountModule } from './account.module';

@Module({
  imports: [AccountModule],
})
export class AppModule {}
