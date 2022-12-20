import { Controller, Get } from '@nestjs/common';
import { MoneyTransfer } from '../../../domain/account/usecases/MoneyTransfer.usecase';

@Controller('account')
export class AccountController {
  constructor(private readonly appService: MoneyTransfer) {}

  @Get()
  getHello(): string {
    return 'Hello World !';
  }
}
