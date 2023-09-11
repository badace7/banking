import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { Roles } from 'src/libs/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/libs/guards/jwt.guard';
import { RolesGuard } from 'src/libs/guards/roles.guard';
import { RoleEnum } from 'src/modules/authentication/core/domain/user';
import { RessourceOwnerGuard } from 'src/libs/guards/ressource-owner.guard';
import { MoneyTransferDTO } from './money-transfer.dto';
import { DepositDTO } from './deposit.dto';
import { WithdrawDTO } from './withdraw.dto';
import { AccountWrite } from './account-write.routes';
import {
  DEPOSIT_PORT,
  IDeposit,
} from '../../../core/_ports/usecases/deposit.iport';
import {
  MONEY_TRANSFER_PORT,
  IMoneyTransfer,
} from '../../../core/_ports/usecases/money-transfer.iport';
import {
  WITHDRAW_PORT,
  IWithdraw,
} from '../../../core/_ports/usecases/withdraw.iport';
import { DepositCommand } from '../../../core/commands/deposit.command';
import { MoneyTransferCommand } from '../../../core/commands/transfer.command';
import { WithdrawCommand } from '../../../core/commands/withdraw.command';

@UseGuards(JwtAuthGuard, RolesGuard, RessourceOwnerGuard)
@Roles(RoleEnum.CUSTOMER)
@Controller(AccountWrite.ROOT)
export class AccountWriteController {
  constructor(
    @Inject(MONEY_TRANSFER_PORT)
    private readonly moneyTransferUsecase: IMoneyTransfer,
    @Inject(WITHDRAW_PORT)
    private readonly withdrawUsecase: IWithdraw,
    @Inject(DEPOSIT_PORT)
    private readonly depositUsecase: IDeposit,
  ) {}

  @Post(AccountWrite.TRANSFER)
  async transferMoney(
    @Body() body: MoneyTransferDTO,
    @Res() response: Response,
  ) {
    try {
      const command = new MoneyTransferCommand(
        body.label,
        body.amount,
        body.origin,
        body.destination,
      );
      await this.moneyTransferUsecase.execute(command);
      response.status(HttpStatus.CREATED).send('The transfer was successful');
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).send(error.message);
    }
  }

  @Post(AccountWrite.DEPOSIT)
  async depositMoney(@Body() body: DepositDTO, @Res() response: Response) {
    try {
      const command = new DepositCommand(body.origin, body.amount);
      await this.depositUsecase.execute(command);
      response.status(HttpStatus.CREATED).send('The deposit was successful');
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).send(error.message);
    }
  }

  @Post(AccountWrite.WITHDRAW)
  async withdrawMoney(@Body() body: WithdrawDTO, @Res() response: Response) {
    try {
      const command = new WithdrawCommand(body.origin, body.amount);
      await this.withdrawUsecase.execute(command);
      response.status(HttpStatus.CREATED).send('The withdraw was successful');
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).send(error.message);
    }
  }
}
