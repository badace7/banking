import { Entity } from 'src/libs/domain/Entity';

type CustomerProperties = {
  firstName: string;
  lastName: string;
  accountNumber: string;
};

class CustomerDomain extends Entity<CustomerProperties> {
  private constructor(properties: CustomerProperties, id?: string) {
    super(properties, id);
  }

  public getlastName(): string {
    return this.props.lastName;
  }

  public setName(lastName: string): void {
    this.props.lastName = lastName;
  }
  public getFirstName(): string {
    return this.props.firstName;
  }

  public setFirstName(firstName: string): void {
    this.props.firstName = firstName;
  }

  public getAccountNumber(): string {
    return this.props.accountNumber;
  }

  public static create(customerData: CustomerProperties): CustomerDomain {
    return new CustomerDomain(customerData);
  }
}

export default CustomerDomain;
