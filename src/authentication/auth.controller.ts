import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "src/models/user/dto/user.login.dto";
import { map } from "rxjs";
import { LoginAdminDto } from "src/models/admin/dto/admin.login.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    
    @Post('login/user')
    async loginUser(@Body() user: LoginUserDto){
        return (await this.authService.loginUser(user)).pipe(map((jwt: string) => ({ token: jwt })))
    }

    @Post('login/admin')
    async loginAdmin(@Body() admin: LoginAdminDto) {
        return (await this.authService.loginAdmin(admin)).pipe(map((jwt: string) => ({ token: jwt })))
    }
}
