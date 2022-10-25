import { Controller, Get } from '@nestjs/common';
import { BankingService } from '../../../domain/usecases/banking.service';

@Controller('banking')
export class BankingController {
  constructor(private readonly appService: BankingService) {}

  @Get()
  getHello(): string {
    return 'Hello World !';
  }
}
