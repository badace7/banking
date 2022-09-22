import { Controller, Get } from '@nestjs/common';
import { TimelineService } from './domain/timeline/timeline.service';

@Controller('posting')
export class AppController {
  constructor(private readonly appService: TimelineService) {}

  @Get()
  test(): string {
    return 'hello';
  }
}
