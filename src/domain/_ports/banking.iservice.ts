import AccountDomain from '../account/account.domain';
import CustomerDomain from '../customer/customer.domain';

export interface IBankingService {
  loginToAccount(customer: CustomerDomain): Promise<AccountDomain>;
}
