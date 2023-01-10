import { Entity } from 'src/libs/domain/entity';

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
    return this.properties.lastName;
  }

  public setName(lastName: string): void {
    this.properties.lastName = lastName;
  }
  public getFirstName(): string {
    return this.properties.firstName;
  }

  public setFirstName(firstName: string): void {
    this.properties.firstName = firstName;
  }

  public getAccountNumber(): string {
    return this.properties.accountNumber;
  }

  public static create(customerData: CustomerProperties): CustomerDomain {
    return new CustomerDomain(customerData);
  }
}

export default CustomerDomain;
