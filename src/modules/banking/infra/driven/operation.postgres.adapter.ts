import { Injectable } from '@nestjs/common';
import { OperationEntity } from './operation.entity';
import { EntityManager } from 'typeorm';

import {
  FlowIndicator,
  Operation,
  OperationType,
} from '../../domain/operation';
import { OperationTypeEntity } from './operation-type.entity';
import { FlowIndicatorEntity } from './flow-indicator.entity';
import { AccountEntity } from './account.entity';
import { IOperationPort } from '../../application/_ports/repositories/operation.iport';

@Injectable()
export class OperationPostgresAdapter implements IOperationPort {
  constructor(private readonly manager: EntityManager) {}
  async getAllByAccountNumber(accountNumber: string): Promise<Operation[]> {
    const operations = await this.manager
      .createQueryBuilder(OperationEntity, 'operation')
      .innerJoinAndSelect('operation.account', 'account')
      .innerJoinAndSelect('operation.operationType', 'operationType')
      .innerJoinAndSelect('operation.flowIndicator', 'flowIndicator')
      .orderBy('operation.date', 'DESC')
      .where('account.number = :number', { number: accountNumber })
      .getMany();

    return operations.map((operation) => this.toDomain(operation));
  }
  async save(operation: Operation): Promise<void> {
    const operationType = await this.manager.findOne(OperationTypeEntity, {
      where: { type: operation.data.type },
    });

    const flowIndicator = await this.manager.findOne(FlowIndicatorEntity, {
      where: { indicator: operation.data.flow },
    });

    const account = await this.manager.findOne(AccountEntity, {
      where: { number: operation.data.account },
    });

    const entity = this.toEntity({
      ...operation.data,
      account: account,
      operationType: operationType,
      flowIndicator: flowIndicator,
    });

    await this.manager.save(OperationEntity, entity);
  }

  private toEntity(operation: {
    id: string;
    label: string;
    amount: number;
    account: AccountEntity;
    operationType: OperationTypeEntity;
    flowIndicator: FlowIndicatorEntity;
    date: Date;
  }): OperationEntity {
    const entity = new OperationEntity();
    entity.id = operation.id;
    entity.label = operation.label;
    entity.amount = operation.amount;
    entity.account = operation.account;
    entity.operationType = operation.operationType;
    entity.flowIndicator = operation.flowIndicator;
    entity.date = operation.date;
    return entity;
  }

  private toDomain(operation: OperationEntity): Operation {
    const domain = Operation.create({
      id: operation.id,
      label: operation.label,
      amount: operation.amount,
      account: operation.account.number,
      type: operation.operationType.type as OperationType,
      flow: operation.flowIndicator.indicator as FlowIndicator,
      date: operation.date,
    });

    return domain;
  }
}
