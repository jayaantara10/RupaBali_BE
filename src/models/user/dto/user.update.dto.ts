import { UserRole } from "src/common/enum/userRole.enum";
import { VerifyStatus } from "src/common/enum/verifyStatus.enum";

export class UpdateProfileUserDto {
    nickname: string
    username: string
    description: string
}

export class UpdateProfilePictureUserDto{
    profilePicture: string
}

export class UpdateBackgroundPictureUserDto{
    backgroundPicture: string
}

export class UpdatePasswordUserDto{
    oldPassword: string
    newPassword: string
}
