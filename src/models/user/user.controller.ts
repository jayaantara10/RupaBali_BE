import { Body, Controller, Get, Param, Post, UseGuards, Request, UseInterceptors, Put, UploadedFile, UploadedFiles, Delete, Res } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/user.create.dto";
import { AdminRoles, UserRoles } from "src/authentication/auth.decorator";
import { AdminRole } from "src/common/enum/adminRole.enum";
import { JwtGuard } from "src/authentication/guards/jwt.guard";
import { AdminRolesGuard, UserRolesGuard } from "src/authentication/guards/roles.guard";
import { UserRole } from "src/common/enum/userRole.enum";
import { diskStorage } from "multer";
import { fileNameFormater } from "src/common/helper/fileNameFormater.helper";
import { createReadStream } from "fs";
import * as fs from 'fs';
import { join } from "path";
import { RequestVerificationUserDto, UpdateIdentityCardUserDto, VerificationUserDto } from "./dto/user.verification.dto";
import { Observable } from "rxjs";
import { SuspendUserDto } from "./dto/user.suspend.dto";
import { UpdateBackgroundPictureUserDto, UpdatePasswordUserDto, UpdateProfilePictureUserDto, UpdateProfileUserDto } from "./dto/user.update.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ){}

    //REGISTER USER
    @Post()
    async registerUser(@Body() userData: CreateUserDto) {
        return this.userService.register(userData);
    }

    //GET LIST USER IN ADMIN
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Get('in-admin')
    getListUserByAdmin() {
        return this.userService.getAllUser();
    }

    //GET LIST USER IN USER
    @UserRoles(UserRole.VISITOR, UserRole.COLLECTOR, UserRole.ARTIST,)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Get('in-user')
    getListUserByUser() {
        return this.userService.getAllUser();
    }

    //GET LIST REQUEST VERIFICATION USER
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.SUPER_ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Get('verification-list')
    getListRequestVerificationUser() {
        return this.userService.getAllRequestVerificationUser();
    }

    //GET DETAIL USER BY ADMIN
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Get('in-admin/:id')
    getDetailUserByAdmin(@Param('id') id) {
        return this.userService.getUserById(id);
    }

    //GET DETAIL USER BY USER
    @UserRoles(UserRole.VISITOR, UserRole.COLLECTOR, UserRole.ARTIST)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Get('in-user/:id')
    getDetailUserByUser(@Param('id') id) {
        return this.userService.getUserById(id);
    }

    //GET PROFILE USER
    @UserRoles(UserRole.VISITOR, UserRole.COLLECTOR, UserRole.ARTIST)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Get('profile')
    getProfileAdmin(@Request() req) {
        const id = req.user.id;
        return this.userService.getUserById(id);
    }

    //USER UPDATE
    @UserRoles(UserRole.VISITOR, UserRole.COLLECTOR, UserRole.ARTIST)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Put('update')
    async selfUpdateUser(@Request() req, @Body() profileData: UpdateProfileUserDto) {
        const id = req.user.id;
        return this.userService.updateProfile(id, profileData);
    }

    //CHANGE PROFILE PICTURE
    @UserRoles(UserRole.ARTIST, UserRole.COLLECTOR, UserRole.VISITOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @UseInterceptors(FileInterceptor(
            'profilePicture',
            { 
                storage: diskStorage({
                    destination: './data/user/profile/',
                    filename: fileNameFormater,
                })
            }
        ))
    @Put('update-profile-picture')
    async updateProfilePicture(@Request() req, @UploadedFile() profilePicture: Express.Multer.File) {
        const id = req.user.id;
        const user = await this.userService.getUserById(id)

        const profilePictureData: UpdateProfilePictureUserDto = {
            profilePicture: profilePicture.filename
        }

        if(user.profilePicture){
            console.log(join(process.cwd(),process.env.ADMIN_PROFILE_DATA + user.profilePicture))
            fs.unlink(
                join(process.cwd(), 
                process.env.USER_PROFILE_DATA + user.profilePicture), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }
        
        return this.userService.updateProfilePicture(id, profilePictureData)
    }

    //CHANGE BACKGROUND PICTURE
    @UserRoles(UserRole.ARTIST, UserRole.COLLECTOR, UserRole.VISITOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @UseInterceptors(FileInterceptor(
            'backgroundPicture',
            { 
                storage: diskStorage({
                    destination: './data/user/profile/',
                    filename: fileNameFormater,
                })
            }
        ))
    @Put('update-background-picture')
    async updateBackgroundPicture(@Request() req, @UploadedFile() backgroundPicture: Express.Multer.File) {
        const id = req.user.id;
        const user = await this.userService.getUserById(id)

        const profilePictureData: UpdateBackgroundPictureUserDto = {
            backgroundPicture: backgroundPicture.filename
        }

        if(user.backgroundPicture){
            fs.unlink(
                join(process.cwd(), 
                process.env.USER_PROFILE_DATA + user.backgroundPicture), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }
        
        return this.userService.updateBackgroundPicture(id, profilePictureData)
    }

    //UPDATE IDENTITY CARD
    @UserRoles(UserRole.ARTIST, UserRole.COLLECTOR, UserRole.VISITOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @UseInterceptors(FileInterceptor(
            'identityCard',
            { 
                storage: diskStorage({
                    destination: './data/user/verification/',
                    filename: fileNameFormater,
                })
            }
        ))
    @Put('update-identity-card')
    async updateIdentityCard(@Request() req, @UploadedFile() identityCard: Express.Multer.File) {
        const id = req.user.id
        const user = await this.userService.getUserById(id)

        const identityCardData: UpdateIdentityCardUserDto = {
            identityCard: identityCard.filename
        }

        if(user.identityCard){
            fs.unlink(
                join(process.cwd(), 
                process.env.USER_VERIFICATION_DATA + user.identityCard), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }
        
        return this.userService.updateIdentityCard(id, identityCardData)
    }

    //USER CHANGE PASSWORD
    @UserRoles(UserRole.ARTIST, UserRole.COLLECTOR, UserRole.VISITOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Put('update-password')
    async updatePassword(@Request() req, @Body() password: UpdatePasswordUserDto) {
        const id = req.user.id
        return this.userService.updatePassword(id, password);
    }

    //CHANGE PASSWORD BY SUPER ADMIN
    @AdminRoles(AdminRole.SUPER_ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Put('update-password-by-super-admin/:id')
    async updatePasswordBySuperAdmin(@Param('id') id, @Body() password: UpdatePasswordUserDto) {
        return this.userService.updatePassword(id, password);
    }

    //USER REQUEST VERIFICATION
    @UserRoles(UserRole.VISITOR, UserRole.COLLECTOR, UserRole.ARTIST)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Put('request-verification')
    async requestVerificationUser(@Request() req, @Body() requestData: RequestVerificationUserDto) {
        const id = req.user.id;
        return this.userService.requestVerification(id, requestData);
    }

    //USER VERIFICATION
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Put('verification/:id')
    async verification(@Param('id') id, @Body() verifyData: VerificationUserDto) {
        return this.userService.verification(id, verifyData);
    }

    //USER SUSPEND
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Put('suspend/:id')
    async suspend(@Param('id') id, @Body() verifyData: SuspendUserDto) {
        return this.userService.suspend(id, verifyData);
    }

    //DELETE USER IT SELF
    @UserRoles(UserRole.VISITOR, UserRole.COLLECTOR, UserRole.ARTIST)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Delete('delete')
    async selfDelete(@Request() req) {
        const id = req.user.id;
        const user = await this.userService.getUserById(id)

        if(user.identityCard){
            fs.unlink(
                join(process.cwd(), 
                process.env.USER_VERIFICATION_DATA + user.identityCard), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }

        if(user.profilePicture){
            console.log(join(process.cwd(),process.env.ADMIN_PROFILE_DATA + user.profilePicture))
            fs.unlink(
                join(process.cwd(), 
                process.env.USER_PROFILE_DATA + user.profilePicture), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }

        if(user.backgroundPicture){
            fs.unlink(
                join(process.cwd(), 
                process.env.USER_PROFILE_DATA + user.backgroundPicture), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }
        return this.userService.delete(id);
    }

    //DELETE USER BY ADMIN
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Delete('delete-by-super-admin/:id')
    async deleteUserByAdmin(@Param('id') id) {
        const user = await this.userService.getUserById(id)

        if(user.identityCard){
            fs.unlink(
                join(process.cwd(), 
                process.env.USER_VERIFICATION_DATA + user.identityCard), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }

        if(user.profilePicture){
            console.log(join(process.cwd(),process.env.ADMIN_PROFILE_DATA + user.profilePicture))
            fs.unlink(
                join(process.cwd(), 
                process.env.USER_PROFILE_DATA + user.profilePicture), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }

        if(user.backgroundPicture){
            fs.unlink(
                join(process.cwd(), 
                process.env.USER_PROFILE_DATA + user.backgroundPicture), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }

        return this.userService.delete(id);
    }

    //STREAM VERIFICATION DOCUMENT
    @Get('verification-document/:documentName')
    getVerificationDocument(@Param('documentName') documentName, @Res() res): Observable<Object>{
        const document = createReadStream(join(process.cwd(), process.env.USER_VERIFICATION_DATA  + documentName))
        return document.pipe(res);
    }

    //STREAM PROFILE DOCUMENT
    @Get('profile/:prictureName')
    getProfilePicture(@Param('pictureName') pictureName, @Res() res): Observable<Object>{
        const picture = createReadStream(join(process.cwd(), process.env.USER_PROFILE_DATA  + pictureName))
        return picture.pipe(res);
    }
}