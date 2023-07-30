import { SetMetadata } from "@nestjs/common";
import { AdminRole } from "src/common/enum/adminRole.enum";
import { UserRole } from "src/common/enum/userRole.enum";

export const USER_ROLES_KEY = 'user_roles'
export const ADMIN_ROLES_KEY = 'admin_roles'
export const UserRoles = (...roles: UserRole[]) => SetMetadata(USER_ROLES_KEY, roles);
export const AdminRoles = (...roles: AdminRole[]) => SetMetadata(ADMIN_ROLES_KEY, roles);