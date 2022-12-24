import { Controller, Get } from '@nestjs/common';
import { MoneyTransferUsecase } from '../../../domain/transaction/usecases/MoneyTransfer.usecase';

@Controller('account')
export class AccountController {
  constructor(private readonly appService: MoneyTransferUsecase) {}

  @Get()
  getHello(): string {
    return 'Hello World !';
  }
}
