import AccountDomain from '../account.domain';
import CustomerDomain from '../../customer/customer.domain';

export interface IAccountService {
  loginToAccount(customer: CustomerDomain): Promise<AccountDomain>;
}
