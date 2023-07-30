import { UserRole } from "src/common/enum/userRole.enum";

export class CreateUserDto {
    username: string
    email: string
    password: string
}