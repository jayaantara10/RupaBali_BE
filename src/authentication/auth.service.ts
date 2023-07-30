import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import Admin from "src/models/admin/admin.entity";
import User from "src/models/user/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from "src/models/user/dto/user.login.dto";
import { from } from "rxjs";
import { LoginAdminDto } from "src/models/admin/dto/admin.login.dto";
import { VerifyStatus } from "src/common/enum/verifyStatus.enum";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Admin) private adminRepository: Repository<Admin>,
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService
    ) {}

    // GET ONE USER BY email
    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({
            select: {
                id: true,
                role: true,
                password: true
            },
            where: { 
                email: email
            }
        });

        if (user) {
            return user;
        }
        
        throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
    }

    // VALIDATE USER
    async validateUser(email: string, password: string) {
        const user = await this.getUserByEmail(email);

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
            delete user.password
            return user
        }

        throw new HttpException('User password is wrong', HttpStatus.NOT_FOUND)
    }

    // LOGIN USER
    async loginUser(loginData: LoginUserDto) {
        try {
            const {email, password} = loginData;
            const user = await this.validateUser(email, password);
            if (user) {
                return from(this.jwtService.signAsync({ user }));
            }
        } catch (error){
            console.log(error.message);
            throw new HttpException(error.message, error.status)
        }
    
    }

    // GET ONE ADMIN BY email
    async getAdminByEmail(email: string) {
        const admin = await this.adminRepository.findOne({
            select: {
                id: true,
                role: true,
                isVerify: true,
                password: true
            },
            where: { 
                email: email
            }
        })

        if (admin) {
            return admin
        }
        
        throw new HttpException('Admin with this email does not exist', HttpStatus.NOT_FOUND);
    }

    // VALIDATE ADMIN
    async validateAdmin(email: string, password: string) {
        const admin = await this.getAdminByEmail(email);

        const isPasswordMatch = await bcrypt.compare(password, admin.password);
        if (isPasswordMatch) {
            if (admin.isVerify){
                delete admin.password
                return admin
            }
            throw new HttpException('Admin has not been verified ', HttpStatus.UNAUTHORIZED)
        } else {
            throw new HttpException('Admin password is wrong', HttpStatus.NOT_FOUND)
        }
    }

    // LOGIN ADMIN
    async loginAdmin(loginData: LoginAdminDto) {
        const {email, password} = loginData;
        const admin = await this.validateAdmin(email, password);
        if (admin) {
            return from(this.jwtService.signAsync({ admin }));
        }
    }

}