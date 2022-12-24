import { ICustomerRepository } from '../../../domain/customer/_ports/customer.irepository';
import CustomerDomain from '../../../domain/customer/domain/customer.domain';

class FakeCustomerRepository implements ICustomerRepository {
  private fakeCustomerEntityManager;

  constructor(customer?: CustomerDomain) {
    this.fakeCustomerEntityManager = new Map<string, CustomerDomain>([
      [customer?.getAccountNumber(), customer],
    ]);
  }
  async findCustomerByAccountNumber(
    accountNumber: string,
  ): Promise<CustomerDomain> {
    return this.fakeCustomerEntityManager.get(accountNumber);
  }
  async saveCustomer(customer: CustomerDomain): Promise<void> {
    this.fakeCustomerEntityManager.set(customer.getAccountNumber(), customer);
  }
  async updateCustomer(
    accountNumber: string,
    customer: CustomerDomain,
  ): Promise<void> {
    this.fakeCustomerEntityManager.delete(accountNumber);
    this.fakeCustomerEntityManager.set(accountNumber, customer);
  }
}

export default FakeCustomerRepository;
