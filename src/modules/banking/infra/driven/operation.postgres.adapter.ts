import { Injectable } from '@nestjs/common';
import { OperationEntity } from './operation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {
  FlowIndicator,
  Operation,
  OperationType,
} from '../../domain/operation';
import { OperationTypeEntity } from './operation-type.entity';
import { FlowIndicatorEntity } from './flow-indicator.entity';
import { AccountEntity } from './account.entity';
import { IOperationPort } from '../../application/_ports/driven/operation.iport';
import { OperationReadModel } from '../../application/queries/operations.read-model';

@Injectable()
export class OperationPostgresAdapter implements IOperationPort {
  constructor(
    @InjectRepository(OperationEntity)
    private readonly operationRepository: Repository<OperationEntity>,
    @InjectRepository(OperationTypeEntity)
    private readonly operationTypeRepository: Repository<OperationTypeEntity>,
    @InjectRepository(FlowIndicatorEntity)
    private readonly FlowIndicatorRepository: Repository<FlowIndicatorEntity>,
    @InjectRepository(AccountEntity)
    private readonly AccountRepository: Repository<AccountEntity>,
  ) {}
  async getAllByAccountNumber(
    accountNumber: string,
  ): Promise<OperationReadModel[]> {
    const operations = await this.operationRepository
      .createQueryBuilder('operation')
      .innerJoin('operation.account', 'account')
      .innerJoinAndSelect('operation.operationType', 'operationType')
      .innerJoinAndSelect('operation.flowIndicator', 'flowIndicator')
      .orderBy('operation.date', 'DESC')
      .where('account.number = :number', { number: accountNumber })
      .getMany();

    return operations.map((operation) => this.toReadModel(operation));
  }
  async save(operation: Operation): Promise<void> {
    const operationType = await this.operationTypeRepository.findOne({
      where: { type: operation.data.type },
    });

    const flowIndicator = await this.FlowIndicatorRepository.findOne({
      where: { indicator: operation.data.flow },
    });

    const account = await this.AccountRepository.findOne({
      where: { number: operation.data.account },
    });

    const entity = this.toEntity({
      ...operation.data,
      account: account,
      operationType: operationType,
      flowIndicator: flowIndicator,
    });

    await this.operationRepository.save(entity);
  }
  async getAllOfAccount(accountNumber: string): Promise<Operation[]> {
    const operations = await this.operationRepository
      .createQueryBuilder('operation')
      .innerJoin('operation.account', 'account')
      .where('account.number = :number', { number: accountNumber })
      .getMany();

    return operations.map((operation) => this.toDomain(operation));
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
      account: operation.account.id,
      type: operation.operationType.type as OperationType,
      flow: operation.flowIndicator.indicator as FlowIndicator,
      date: operation.date,
    });

    return domain;
  }

  private toReadModel(operation: OperationEntity): OperationReadModel {
    const readModel = OperationReadModel.create({
      id: operation.id,
      label: operation.label,
      amount: operation.amount,
      type: operation.operationType.type,
      flow: operation.flowIndicator.indicator,
      date: operation.date,
    });

    console.log(readModel);

    return readModel;
  }
}
