import { FindOperationsByNumberQuery } from '../../queries/find-operations-by-account-number.query';
import { OperationReadModel } from '../../queries/operation.read-model';

export const FIND_OPERATIONS_BY_ACCOUNT_NUMBER_PORT =
  'IFindOperationByAccountNumber';

export interface IFindOperationByAccountNumber {
  execute(query: FindOperationsByNumberQuery): Promise<OperationReadModel[]>;
}
