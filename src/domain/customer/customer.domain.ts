import { Entity } from '../../core/domain/Entity';

interface CustomerProperties {
  lastName: string;
  firstName: string;
}

class CustomerDomain extends Entity<CustomerProperties> {
  private constructor(properties: CustomerProperties, id?: string) {
    super(properties, id);
  }

  public getName(): string {
    return this.properties.firstName;
  }

  public setName(name: string): void {
    this.properties.lastName = name;
  }
  public getFirstName(): string {
    return this.properties.firstName;
  }

  public setFirstName(firstName: string): void {
    this.properties.firstName = firstName;
  }

  public static create(
    customerData: CustomerProperties,
    id?: string,
  ): CustomerDomain {
    return new CustomerDomain(customerData, id);
  }
}

export default CustomerDomain;
