import { UserRole } from "src/common/enum/userRole.enum";
import { VerifyStatus } from "src/common/enum/verifyStatus.enum";

export class RequestVerificationUserDto {
    fullname: string
    role: UserRole
}

export class UpdateIdentityCardUserDto {
    identityCard: string
}

export class VerificationUserDto {
    verifyStatus: VerifyStatus
    verifivcationNote: string
}

