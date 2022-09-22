import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TimelineService } from './domain/timeline/timeline.service';
import FakeTimelineRepository from './infrastructure/FakeTimelineRepository';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    TimelineService,
    { provide: 'IPostingRepository', useClass: FakeTimelineRepository },
    { provide: 'IPostingService', useClass: TimelineService },
  ],
})
export class AppModule {}
