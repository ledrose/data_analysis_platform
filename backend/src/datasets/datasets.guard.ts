import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/auth/user.service';

@Injectable()
export class DatasetsGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const {dataset_id} = request.params;
    if (!request["user"]) {
      throw new UnauthorizedException();
    }
    // console.log(await this.userService.isUserHasDatasetAccess(request["user"],dataset_id));
    return (await this.userService.isUserHasDatasetAccess(request["user"],dataset_id))!=null;
  }
}
