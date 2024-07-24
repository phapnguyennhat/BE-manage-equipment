import { role } from 'src/models/user.entity';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { PayLoadType } from 'src/types/payLoad.type';

@Injectable()
export class JwtAdminGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<TUser = PayLoadType>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    // console.log(user);
    if (user.role === role.ADMIN) {
      return user;
    }
    throw err || new UnauthorizedException("User isn't an admin");
  }
}
