import { Injectable } from '@nestjs/common';
import { OperationEntity } from '../entities/operation.entity';
import { EntityManager } from 'typeorm';

import { Operation } from '../../../domain/operation';
import { IOperationPort } from '../../../application/_ports/repositories/operation.iport';
import { OperationMapper } from '../mappers/operation.mapper';
import { FlowIndicatorEntity } from '../entities/flow-indicator.entity';
import { FlowIndicator } from 'src/modules/banking/domain/flow-indicator';
import { OperationTypeEntity } from '../entities/operation-type.entity';
import { OperationType } from 'src/modules/banking/domain/operation-type';

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
