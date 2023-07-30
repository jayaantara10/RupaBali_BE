import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { AdminRole } from "src/common/enum/adminRole.enum";
import { UserRole } from "src/common/enum/userRole.enum";
import { ADMIN_ROLES_KEY, USER_ROLES_KEY } from "../auth.decorator";

@Injectable()
export class UserRolesGuard implements CanActivate {

    constructor(private reflector: Reflector) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {

        const requiredUserRoles = this.reflector.getAllAndOverride<UserRole[]>(USER_ROLES_KEY, [
            context.getHandler(),
            context. getClass
        ])

        if(!requiredUserRoles ) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        console.log(context.switchToHttp().getRequest())

        return requiredUserRoles.some((role) => user.role?.includes(role));
    }
}

@Injectable()
export class AdminRolesGuard implements CanActivate {

    constructor(private reflector: Reflector) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {

        const requiredAdminRoles = this.reflector.getAllAndOverride<AdminRole[]>(ADMIN_ROLES_KEY, [
            context.getHandler(),
            context. getClass
        ])

        if(!requiredAdminRoles) {
            return true
        } 

        const { user } = context.switchToHttp().getRequest()

        return requiredAdminRoles.some((role) => user.role?.includes(role))
    }

}