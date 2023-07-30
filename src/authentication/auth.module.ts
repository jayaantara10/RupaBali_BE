import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import Admin from "src/models/admin/admin.entity";
import User from "src/models/user/user.entity";
import { AuthService } from "./auth.service";
import { JwtGuard } from "./guards/jwt.guard";
import { JwtStrategy } from "./guards/jwt.strategy";
import { AdminRolesGuard, /*UserRolesGuard*/ } from "./guards/roles.guard";
import { AuthController } from "./auth.controller";


@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: process.env.JWT_SECRET,
                signOptions: {expiresIn: process.env.JWT_EXPIRATION_TIME}
            }),
        }),
        TypeOrmModule.forFeature([Admin, User])
    ],
    providers: [AuthService, JwtGuard, JwtStrategy, AdminRolesGuard],
    controllers: [AuthController]
})
export class AuthModule {}