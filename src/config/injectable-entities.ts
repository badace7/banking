import { AccountEntity } from 'src/modules/account/_write/adapters/secondary/entities/account.entity';
import { RoleEntity } from 'src/modules/authentication/adapters/secondary/entities/role.entity';
import { UserEntity } from 'src/modules/authentication/adapters/secondary/entities/user.entity';
import { FlowIndicatorEntity } from 'src/modules/operation/_write/adapters/flow-indicator.entity';
import { OperationTypeEntity } from 'src/modules/operation/_write/adapters/operation-type.entity';
import { OperationEntity } from 'src/modules/operation/_write/adapters/operation.entity';

export const entities = [
  UserEntity,
  RoleEntity,
  AccountEntity,
  OperationEntity,
  OperationTypeEntity,
  FlowIndicatorEntity,
];
