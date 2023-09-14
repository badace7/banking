import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import {
  GET_BALANCE_PORT,
  IGetBalance,
} from '../../../_ports/get-balance.iport';
import { GetBalanceQuery } from '../../../core/queries/get-balance.query';
import { AccountRead } from './account-read.routes';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/libs/guards/jwt.guard';
import { RessourceOwnerGuard } from 'src/libs/guards/ressource-owner.guard';
import { RolesGuard } from 'src/libs/guards/roles.guard';
import { RoleEnum } from 'src/modules/authentication/core/domain/user';

@UseGuards(JwtAuthGuard, RolesGuard, RessourceOwnerGuard)
@Roles(RoleEnum.CUSTOMER)
@Controller(AccountRead.ROOT)
export class AccountReadController {
  constructor(
    @Inject(GET_BALANCE_PORT)
    private readonly getBalanceUsecase: IGetBalance,
  ) {}

  @Get(AccountRead.BALANCE)
  async getBalance(
    @Param('accountNumber') accountNumber: string,
    @Res() response: Response,
  ) {
    try {
      const query = new GetBalanceQuery(accountNumber);
      const balanceData = await this.getBalanceUsecase.execute(query);
      response.status(HttpStatus.OK).send(balanceData);
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).send(error.message);
    }
  }
}
