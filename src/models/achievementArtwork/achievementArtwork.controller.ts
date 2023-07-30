import { Body, Controller, Delete, Get, Param, Post, Put, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { AchievementArtworkService } from "./achievementArtwork.service";
import { AdminRoles, UserRoles } from "src/authentication/auth.decorator";
import { UserRole } from "src/common/enum/userRole.enum";
import { JwtGuard } from "src/authentication/guards/jwt.guard";
import { AdminRolesGuard, UserRolesGuard } from "src/authentication/guards/roles.guard";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { fileNameFormater } from "src/common/helper/fileNameFormater.helper";
import { CreateAchievementArtworkDto } from "./dto/achievementArtwork.create.dto";
import { UpdateAchievementArtworkDto, UpdateAchievementCertificateDto, UpdateAchievementDocumentationDto } from "./dto/achievementArtwork.update.dto";
import { createReadStream } from "fs";
import * as fs from 'fs';
import { join } from "path";
import { Observable } from "rxjs";
import { AdminRole } from "src/common/enum/adminRole.enum";

@Controller('achievement-artwork')
export class AchievementArtworkController{
    constructor(
        private readonly achievementService: AchievementArtworkService,
    ){}

    //CREATE ACHIEVEMENT
    @UserRoles(UserRole.ARTIST, UserRole.COLLECTOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @UseInterceptors(FileFieldsInterceptor(
        [
            { name: 'documentation', maxCount: 1 },
            { name: 'certificate', maxCount: 1 },
        ],
        { 
            storage: diskStorage({
                destination: './data/achievementArtwork/document/',
                filename: fileNameFormater,
            })
        }
    ))
    @Post()
    async create(@Body() achievementData: CreateAchievementArtworkDto,  @UploadedFiles() document: { documentaion: Express.Multer.File[], certificate: Express.Multer.File[]}) {
        achievementData.documentation = document.documentaion[0].filename
        achievementData.certificate = document.certificate[0].filename
        return this.achievementService.create(achievementData);
    }
    
    //GET LIST ACHIEVEMENT IN ADMIN
    @AdminRoles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN, AdminRole.VALIDATOR)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Get('in-admin/by-artwork/:id')
    getListAchievementByArtworkInAdmin(@Param('id') id) {
        return this.achievementService.getAllAchievementByArtwork(id);
    }

    //GET LIST ACHIEVEMENT IN USER
    @UserRoles(UserRole.ARTIST, UserRole.COLLECTOR, UserRole.VISITOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Get('in-user/by-artwork/:id')
    getListAchievementByArtworkInUser(@Param('id') id) {
        return this.achievementService.getAllAchievementByArtwork(id);
    }

    //GET DETAIL ACHIEVEMENT IN ADMIN
    @AdminRoles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN, AdminRole.VALIDATOR)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Get('in-admin/:id')
    getDetailAchievementInAdmin(@Param('id') id) {
        return this.achievementService.getAchievementById(id);
    }

    @UserRoles(UserRole.ARTIST, UserRole.COLLECTOR, UserRole.VISITOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Get('in-user/:id')
    getDetailAchievementInUser(@Param('id') id) {
        return this.achievementService.getAchievementById(id);
    }

    //UPDATE ACHIEVEMENT
    @UserRoles(UserRole.ARTIST, UserRole.VISITOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Put('update-data/:id')
    async updateAchievement(@Param('id') id, @Body() achievementData: UpdateAchievementArtworkDto,   @UploadedFiles() document: { documentation: Express.Multer.File[], certificate: Express.Multer.File[]}) {
        return this.achievementService.update(id, achievementData);
    }

    //UPDATE DOCUMENTATION
    @UserRoles(UserRole.ARTIST, UserRole.VISITOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @UseInterceptors(FileInterceptor(
        'documentation',
        { 
            storage: diskStorage({
                destination: './data/artworkAchievement/document/',
                filename: fileNameFormater,
            })
        }
    ))
    @Put('update-documentation/:id')
    async updateImage(@Param('id') id, @UploadedFile() documentation: Express.Multer.File) {
        const achievement = await this.achievementService.getAchievementById(id)

        const documentationData: UpdateAchievementDocumentationDto = {
            documentation: documentation.filename
        }

        if(achievement.documentation){
            fs.unlink(
                join(process.cwd(), 
                process.env.ARTWORK_ACHIEVEMENT_DATA + achievement.documentation), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }
        
        return this.achievementService.updateDocumentation(id, documentationData)
    }

    //UPDATE CERTIFICATE
    @UserRoles(UserRole.ARTIST, UserRole.VISITOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @UseInterceptors(FileInterceptor(
        'certificate',
        { 
            storage: diskStorage({
                destination: './data/artworkAchievement/document/',
                filename: fileNameFormater,
            })
        }
    ))
    @Put('update-certificate/:id')
    async updateCertificate(@Param('id') id, @UploadedFile() certificate: Express.Multer.File) {
        const achievement = await this.achievementService.getAchievementById(id)

        const certificateData: UpdateAchievementCertificateDto = {
            certificate: certificate.filename
        }

        if(achievement.certificate){
            fs.unlink(
                join(process.cwd(), 
                process.env.ARTWORK_ACHIEVEMENT_DATA + achievement.certificate), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }
        
        return this.achievementService.updateCertificate(id, certificateData)
    }

    //DELETE ACHIEVEMENT
    @UserRoles(UserRole.ARTIST, UserRole.VISITOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Delete('delete/:id')
    async delete(@Param('id') id) {
        const achievement = await this.achievementService.getAchievementById(id)

        if(achievement.documentation){
            fs.unlink(
                join(process.cwd(), 
                process.env.ARTWORK_ACHIEVEMENT_DATA + achievement.documentation), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }

        if(achievement.certificate){
            fs.unlink(
                join(process.cwd(), 
                process.env.ARTWORK_ACHIEVEMENT_DATA + achievement.certificate), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }
        
        return this.achievementService.delete(id);
    }

    //STREAM ACHIEVEMENT DOCUMENT
    @Get('document/:documentName')
    getDocument(@Param('documentName') documentName, @Res() res): Observable<Object>{
        const document = createReadStream(join(process.cwd(), process.env.ARTWORK_ACHIEVEMENT_DATA  + documentName))
        return document.pipe(res);
    }
}