import { Injectable } from '@nestjs/common';
import { OperationEntity } from './operation.entity';
import { EntityManager } from 'typeorm';

import { Operation } from '../../domain/operation';
import { IOperationPort } from '../../application/_ports/repositories/operation.iport';
import { OperationMapper } from './operation.mapper';

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
}
