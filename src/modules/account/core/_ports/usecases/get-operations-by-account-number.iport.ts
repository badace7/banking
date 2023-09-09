import { GetOperationsByNumberQuery } from '../../queries/get-operations-by-account-number.query';
import { OperationReadModel } from '../../queries/operation.read-model';

export const GET_OPERATIONS_BY_ACCOUNT_NUMBER_PORT =
  'IGetOperationByAccountNumber';

export interface IGetOperationByAccountNumber {
  execute(query: GetOperationsByNumberQuery): Promise<OperationReadModel[]>;
}
