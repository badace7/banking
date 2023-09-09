import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from 'src/modules/authentication/core/domain/user';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);
