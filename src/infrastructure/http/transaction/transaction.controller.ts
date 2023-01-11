import { Controller, Get, HttpStatus, Inject, Res } from '@nestjs/common';
import { Response } from 'express';
import { ITransferRequest } from 'src/domain/account/_ports/input/transfer.irequest';

@Controller('account')
export class AccountController {
  constructor(
    @Inject('ITransferRequest')
    private readonly MoneyTransfer: ITransferRequest,
  ) {}

  @Get()
  async getHello(@Res() response: Response) {
    return response.status(HttpStatus.OK).send('hello');
  }
}
