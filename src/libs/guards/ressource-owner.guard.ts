import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RessourceOwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const submittedAccountNumber =
      request.params.accountNumber || request.body.origin;

    const isRessourceOwner = user.accountNumber === submittedAccountNumber;

    if (!isRessourceOwner) {
      return false;
    }

    return true;
  }
}
