import { Controller, Get } from '@nestjs/common';
import { AccountService } from '../../../domain/account/account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly appService: AccountService) {}

  @Get()
  getHello(): string {
    return 'Hello World !';
  }
}
