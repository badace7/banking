export enum Banking {
  ROOT = 'banking',
  BALANCE = 'account/balance/:accountNumber',
  OPERATIONS = 'account/operations/:accountNumber',
  TRANSFER = 'account/operation/transfer',
  DEPOSIT = 'account/operation/deposit',
  WITHDRAW = 'account/operation/withdraw',
}
