import { Body, Controller, Get, Param, Post, Put, Res, UploadedFiles, UseGuards, UseInterceptors, Request, UploadedFile, Delete } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { CreateAdminDto } from "./dto/admin.create.dto";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { fileNameFormater } from "src/common/helper/fileNameFormater.helper";
import { diskStorage } from "multer";
import { Observable, of } from "rxjs";
import { join } from "path";
import { createReadStream } from "fs";
import * as fs from 'fs';
import { AdminRoles } from "src/authentication/auth.decorator";
import { AdminRole } from "src/common/enum/adminRole.enum";
import { JwtGuard } from "src/authentication/guards/jwt.guard";
import { AdminRolesGuard } from "src/authentication/guards/roles.guard";
import { UpdatePasswordAdminDto, UpdateProfileAdminDto, UpdateProfilePictureAdminDto } from "./dto/admin.update.dto";
import { VerificationAdminDto } from "./dto/admin.verification.dto";
import { CheckEmailAdminDto } from "./dto/admin.checkEmail.dto";

@Controller('admin')
export class AdminController{
    constructor(
        private readonly adminService: AdminService,
    ){}

    //REGISTER ADMIN
    @Post()
    @UseInterceptors(FileFieldsInterceptor(
        [
            { name: 'identityCard', maxCount: 1 },
            { name: 'provingDocument', maxCount: 1 },
        ],
        { 
            storage: diskStorage({
                destination: './data/admin/verification/',
                filename: fileNameFormater,
            })
        }
    ))
    async registerAdmin(@Body() adminData: CreateAdminDto, @UploadedFiles() files: { identityCard: Express.Multer.File[], provingDocument: Express.Multer.File[] }) {
        adminData.identityCard = files.identityCard[0].filename
        adminData.provingDocument = files.provingDocument[0].filename

        return this.adminService.register(adminData)
    }

    //ChECK EMAIL
    @Get('check-email/:email')
    checkEmail(@Param('email') email) {
        return this.adminService.isAdminExist(email)
    }

    //GET LIST ADMIN
    @AdminRoles(AdminRole.SUPER_ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Get()
    getListAdmin() {
        return this.adminService.getAllAdmin();
    }

    //GET LIST REQUEST VERIFICATION ADMIN
    @AdminRoles(AdminRole.SUPER_ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Get('verification-list')
    getListRequestVerificationAdmin() {
        return this.adminService.getAllRequestVerificationAdmin();
    }

    //GET PROFILE ADMIN
    @AdminRoles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN, AdminRole.VALIDATOR)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Get('profile')
    getProfileAdmin(@Request() req) {
        const id = req.user.id
        return this.adminService.getAdminById(id)
    }

    //GET DETAIL ADMIN 
    @AdminRoles(AdminRole.SUPER_ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Get(':id')
    getDetailAdmin(@Param('id') id) {
        return this.adminService.getAdminById(id);
    }

    //UPDATE PROFILE
    @AdminRoles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN, AdminRole.VALIDATOR)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Put('update-profile')
    async updateProfile(@Request() req, @Body() profileData: UpdateProfileAdminDto) {
        const id = req.user.id;
        return this.adminService.updateProfile(id, profileData);
    }

    //CHANGE PROFILE PICTURE
    @AdminRoles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN, AdminRole.VALIDATOR)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @UseInterceptors(FileInterceptor(
            'profilePicture',
            { 
                storage: diskStorage({
                    destination: './data/admin/profile/',
                    filename: fileNameFormater,
                })
            }
        ))
    @Put('update-profile-picture')
    async updateProfilePicture(@Request() req, @UploadedFile() profilePicture: Express.Multer.File) {
        const id = req.user.id;
        const admin = await this.adminService.getAdminById(id)

        const profilePictureData: UpdateProfilePictureAdminDto = {
            profilePicture: profilePicture.filename
        }

        if(admin.profilePicture){
            fs.unlink(
                join(process.cwd(), 
                process.env.ADMIN_PROFILE_DATA + admin.profilePicture), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }
        
        return this.adminService.updateProfilePicture(id, profilePictureData)
    }

    //ADMIN UPDATE PASSWORD
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.VALIDATOR)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Put('update-password')
    async updatePassword(@Request() req, @Body() passwordData: UpdatePasswordAdminDto) {
        const id = req.user.id
        return this.adminService.updatePassword(id, passwordData);
    }

    //UPDATE PASSWORD BY SUPER ADMIN
    @AdminRoles(AdminRole.SUPER_ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Put('update-password-by-super-admin/:id')
    async updatePasswordBySuperAdmin(@Param('id') id, @Body() passwordData: UpdatePasswordAdminDto) {
        return this.adminService.updatePassword(id, passwordData);
    }

    //ADMIN VERIFICATION
    @AdminRoles(AdminRole.SUPER_ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Put('verification/:id')
    async verificationAdmin(@Param('id') id, @Body() verifyData: VerificationAdminDto) {
        return this.adminService.verification(id, verifyData);
    }

    //DELETE ADMIN IT SELF
    @AdminRoles(AdminRole.SUPER_ADMIN,AdminRole.ADMIN,AdminRole.VALIDATOR)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Delete('delete')
    async selfDeleteAdmin(@Request() req) {
        const id = req.user.id;

        const admin = await this.adminService.getAdminById(id)

        if(admin.profilePicture){
            fs.unlink(
                join(process.cwd(), 
                process.env.ADMIN_PROFILE_DATA + admin.profilePicture), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }

        if(admin.identityCard){
            fs.unlink(
                join(process.cwd(), 
                process.env.ADMIN_VERIFICATION_DATA + admin.identityCard), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }

        return this.adminService.delete(id);
    }

    //DELETE ADMIN BY SUPER ADMIN
    @AdminRoles(AdminRole.SUPER_ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Delete('delete-by-super-admin/:id')
    async deleteAdminBySuperAdmin(@Param('id') id) {
        const admin = await this.adminService.getAdminById(id)

        if(admin.profilePicture){
            fs.unlink(
                join(process.cwd(), 
                process.env.ADMIN_PROFILE_DATA + admin.profilePicture), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }

        if(admin.identityCard){
            fs.unlink(
                join(process.cwd(), 
                process.env.ADMIN_VERIFICATION_DATA + admin.identityCard), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }

        return this.adminService.delete(id);
    }

    //STREAM VERIFICATION DOCUMENT
    @Get('verification-document/:documentName')
    getVerificationDocument(@Param('documentName') documentName, @Res() res): Observable<Object>{
        const document = createReadStream(join(process.cwd(), process.env.ADMIN_VERIFICATION_DATA  + documentName))
        return document.pipe(res);
    }

    //STREAM PROFILE DOCUMENT
    @Get('profile-picture/:pictureName')
    getProfilePicture(@Param('pictureName') pictureName, @Res() res): Observable<Object>{
        const picture = createReadStream(join(process.cwd(), process.env.ADMIN_PROFILE_DATA  + pictureName))
        return picture.pipe(res);
    }
}
