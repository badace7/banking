import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CustomerDomain from 'src/domain/customer/entities/customer.domain';
import { ICustomerRepository } from 'src/domain/customer/_ports/customer.irepository';
import { Repository } from 'typeorm';
import { CustomerEntity } from './customer.entity';

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly repository: Repository<CustomerEntity>,
  ) {}
  findCustomerByAccountNumber(accountNumber: string): Promise<CustomerDomain> {
    throw new Error('Method not implemented.');
  }
  saveCustomer(customer: CustomerDomain): Promise<void> {
    throw new Error('Method not implemented.');
  }
  updateCustomer(
    accountNumber: string,
    customer: CustomerDomain,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
