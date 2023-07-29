import { Injectable } from '@nestjs/common';

import { OperationEntity } from './operation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IOperationPort } from '../../application/_ports/operation.iport';
import { Operation } from '../../domain/operation';

@Injectable()
export class OperationPostgresAdapter implements IOperationPort {
  constructor(
    @InjectRepository(OperationEntity)
    private readonly repository: Repository<OperationEntity>,
  ) {}
  async save(operation: Operation): Promise<void> {
    await this.repository.save(operation.data);
  }
  async getAllOfCustomer(accountNumber: string): Promise<Operation[]> {
    const operations = await this.repository.find({
      where: [{ origin: accountNumber }, { destination: accountNumber }],
    });

    return operations.map((o) =>
      Operation.create({
        id: o.id,
        label: o.label,
        amount: o.amount,
        origin: o.origin,
        destination: o.destination,
        type: o.type,
        date: o.date,
      }),
    );
  }
}
