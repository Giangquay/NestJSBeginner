import { Role } from "src/enum/common.enum";
import { CanActivate,ExecutionContext,mixin,Type } from "@nestjs/common";
import RequestWithUser from "src/interface/equestWithUser.interface";
import { AuthGuard } from "@nestjs/passport";

const RoleGuard = (role: Role): Type<CanActivate> => {
    class RoleGuardMixin extends AuthGuard('jwt') implements CanActivate  {
     async canActivate(context: ExecutionContext) {
        await super.canActivate(context);
        const request = context.switchToHttp().getRequest<RequestWithUser>();
        const user = request.user;
   
        return user?.roles.includes(role);
      }
    }
   
    return mixin(RoleGuardMixin);
  }
   
  export default RoleGuard;