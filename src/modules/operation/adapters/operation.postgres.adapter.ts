import { Injectable } from '@nestjs/common';

import { EntityManager } from 'typeorm';

import { OperationEntity } from './operation.entity';
import { OperationMapper } from './operation.mapper';
import { FlowIndicatorEntity } from './flow-indicator.entity';

import { OperationTypeEntity } from './operation-type.entity';
import { IOperationPort } from '../core/_ports/operation.iport';
import { FlowIndicator } from '../core/domain/flow-indicator';
import { Operation } from '../core/domain/operation';
import { OperationType } from '../core/domain/operation-type';

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

    return operations.map((operation) => OperationMapper.toDomain(operation));
  }
  async save(operation: Operation): Promise<void> {
    const entity = OperationMapper.toEntity(operation);
    await this.manager.save(OperationEntity, entity);
  }

  async getFlowIndicatorById(id: number) {
    const entity = await this.manager.findOne(FlowIndicatorEntity, {
      where: { id },
    });
    return new FlowIndicator(entity.id, entity.indicator);
  }

  async getOperationTypeById(id: number) {
    const entity = await this.manager.findOne(OperationTypeEntity, {
      where: { id },
    });
    return new OperationType(entity.id, entity.type);
  }
}
