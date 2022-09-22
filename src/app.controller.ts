import { Controller, Get } from '@nestjs/common';
import { TimelineService } from './domain/timeline/timeline.service';

@Controller('timelines')
export class AppController {
  constructor(private readonly appService: TimelineService) {}

  @Get()
  test(): string {
    return 'Hello World !';
  }
}
