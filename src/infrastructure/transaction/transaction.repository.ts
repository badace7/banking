import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import TransferDomain from 'src/domain/account/models/transfer.domain';
import { ITransactionRepository } from 'src/domain/account/_ports/output/transaction.irepository';
import { Repository } from 'typeorm';
import { TransferEntity } from './transaction.entity';

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
