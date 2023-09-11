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
  GET_OPERATIONS_BY_ACCOUNT_NUMBER_PORT,
  IGetOperationByAccountNumber,
} from '../core/get-operations-by-account-number.iport';
import { GetOperationsByNumberQuery } from '../core/get-operations-by-account-number.query';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/libs/guards/jwt.guard';
import { RessourceOwnerGuard } from 'src/libs/guards/ressource-owner.guard';
import { RolesGuard } from 'src/libs/guards/roles.guard';
import { RoleEnum } from 'src/modules/authentication/core/domain/user';

export enum OperationRead {
  ROOT = 'operations',
  OPERATIONS = ':accountNumber',
}

@UseGuards(JwtAuthGuard, RolesGuard, RessourceOwnerGuard)
@Roles(RoleEnum.CUSTOMER)
@Controller(OperationRead.ROOT)
export class OperationReadController {
  constructor(
    @Inject(GET_OPERATIONS_BY_ACCOUNT_NUMBER_PORT)
    private readonly getOperationsByAccountNumber: IGetOperationByAccountNumber,
  ) {}

  @Get(OperationRead.OPERATIONS)
  async findAllOperations(
    @Param('accountNumber') accountNumber: string,
    @Res() response: Response,
  ) {
    try {
      const query = new GetOperationsByNumberQuery(accountNumber);
      const operations = await this.getOperationsByAccountNumber.execute(query);
      response.status(HttpStatus.OK).send(operations);
    } catch (error) {
      response.status(HttpStatus.NOT_FOUND).send(error.message);
    }
  }
}
