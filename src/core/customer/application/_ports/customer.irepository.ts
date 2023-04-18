import CustomerDomain from '../../domain/customer.domain';

export interface ICustomerRepository {
  findCustomerByAccountNumber(accountNumber: string): Promise<CustomerDomain>;
  saveCustomer(customer: CustomerDomain): Promise<void>;
  updateCustomer(
    accountNumber: string,
    customer: CustomerDomain,
  ): Promise<void>;
}
