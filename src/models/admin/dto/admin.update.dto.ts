export class UpdateProfileAdminDto{
    nickname: string
}

export class UpdateProfilePictureAdminDto{
    profilePicture: string
}

export class UpdatePasswordAdminDto{
    oldPassword: string
    newPassword: string
}