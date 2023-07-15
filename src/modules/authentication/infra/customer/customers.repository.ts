import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { ICustomerRepository } from 'src/modules/authentication/application/_ports/customer.irepository';
import CustomerDomain from 'src/modules/authentication/domain/customer.domain';

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
