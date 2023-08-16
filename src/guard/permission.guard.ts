import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import RequestWithUser from "src/interface/equestWithUser.interface";
import { Permission } from "src/enum/common.enum";

const PremissionGuard = (premissions:Permission):Type<CanActivate>=>{
    class PremissionGuardMixin extends AuthGuard('jwt') implements CanActivate{
        async canActivate(context: ExecutionContext) {
            await super.canActivate(context);
            const result = context.switchToHttp().getRequest<RequestWithUser>();
            const user =result.user;
            return user?.permissions.includes(premissions);
        }
    }
    return mixin(PremissionGuardMixin);
}

export default PremissionGuard;