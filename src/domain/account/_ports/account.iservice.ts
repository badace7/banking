import CustomerDomain from '../../customer/customer.domain';
import AccountDomain from '../domain/account.domain';

export interface IAccountService {
  loginToAccount(customer: CustomerDomain): Promise<AccountDomain>;
}
