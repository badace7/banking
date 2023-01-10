import { Controller, Get, HttpStatus, Inject, Res } from '@nestjs/common';
import { Response } from 'express';
import { ITransferRequest } from 'src/domain/account/input/transfer.irequest';

@Controller('transaction')
export class TransactionController {
  constructor(
    @Inject('ITransferRequest')
    private readonly MoneyTransfer: ITransferRequest,
  ) {}

  @Get()
  async getHello(@Res() response: Response) {
    return response.status(HttpStatus.OK).send('hello');
  }
}
