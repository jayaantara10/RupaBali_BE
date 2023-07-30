import { AdminRole } from "src/common/enum/adminRole.enum"

export class CreateAdminDto{
    fullname: string
    nickname: string
    email: string
    password: string
    role: AdminRole
    identityCard: string
    provingDocument: string
}