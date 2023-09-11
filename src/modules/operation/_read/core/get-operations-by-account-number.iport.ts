import { GetOperationsByNumberQuery } from './get-operations-by-account-number.query';
import { OperationReadModel } from './operation.read-model';

export const GET_OPERATIONS_BY_ACCOUNT_NUMBER_PORT =
  'IGetOperationByAccountNumber';

export interface IGetOperationByAccountNumber {
  execute(query: GetOperationsByNumberQuery): Promise<OperationReadModel[]>;
}
