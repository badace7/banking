import { Operation } from 'src/modules/banking/domain/operation';
import { FindOperationsByNumberQuery } from '../../queries/find-operations-by-account-number.query';

export const FIND_OPERATIONS_BY_ACCOUNT_NUMBER_PORT =
  'IFindOperationByAccountNumber';

export interface IFindOperationByAccountNumber {
  execute(query: FindOperationsByNumberQuery): Promise<Operation[]>;
}
