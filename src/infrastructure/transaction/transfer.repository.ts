import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransferEntity } from './transfer.entity';
import { ITransactionRepository } from 'src/core/account/application/_ports/output/transaction.irepository';
import TransferDomain from 'src/core/account/domain/transfer.domain';

@Injectable()
export class TransferRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(TransferEntity)
    private readonly repository: Repository<TransferEntity>,
  ) {}
  findTransaction(transactionId: string): Promise<TransferDomain> {
    throw new Error('Method not implemented.');
  }
  saveTransaction(transaction: TransferDomain): Promise<TransferDomain> {
    throw new Error('Method not implemented.');
  }
  getAll(): Promise<TransferDomain[]> {
    throw new Error('Method not implemented.');
  }
}
