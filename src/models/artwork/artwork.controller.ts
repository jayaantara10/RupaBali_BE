import { Body, Controller, Get, Post, UploadedFiles, UseGuards, UseInterceptors, Request, Param, UploadedFile, Put, Delete, Res } from "@nestjs/common";
import { ArtworkService } from "./artwork.service";
import { AdminRoles, UserRoles } from "src/authentication/auth.decorator";
import { UserRole } from "src/common/enum/userRole.enum";
import { JwtGuard } from "src/authentication/guards/jwt.guard";
import { AdminRolesGuard, UserRolesGuard } from "src/authentication/guards/roles.guard";
import { diskStorage } from "multer";
import { fileNameFormater } from "src/common/helper/fileNameFormater.helper";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { CreateArtworkDto } from "./dto/artwork.create.dto";
import { AdminRole } from "src/common/enum/adminRole.enum";
import { UpdateArtworkCertificateDto, UpdateArtworkDto, UpdateArtworkImageDto, UpdateArtworkLocationDto, UpdateArtworkVideoDto } from "./dto/artwork.update.dto";
import { createReadStream } from "fs";
import * as fs from 'fs';
import { join } from "path";
import { Observable } from "rxjs";
import { ValidationArtworkDto } from "./dto/artwork.validation.dto";
import { SuspendArtworkDto } from "./dto/artwork.suspend.dto";
import { ValidationStatus } from "src/common/enum/validationStatus.enum";

@Controller('artwork')
export class ArtworkController{
    constructor(
        private readonly artworkService: ArtworkService,
    ){}

    //CREATE ARTWORK
    @UserRoles(UserRole.ARTIST, UserRole.COLLECTOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @UseInterceptors(FileInterceptor(
        'image',
        { 
            storage: diskStorage({
                destination: './data/artwork/document/',
                filename: fileNameFormater,
            })
        }
    ))
    @Post()
    async createArtwork(@Request() req, @Body() artworkData: CreateArtworkDto, @UploadedFile() image: Express.Multer.File) {
        artworkData.userId = req.user.id
        artworkData.image = image.filename
        return this.artworkService.create(artworkData);
    }
    
    //GET LIST ARTWORK IN ADMIN
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.VALIDATOR)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Get('in-admin')
    getListArtworkInAdmin() {
        return this.artworkService.getAllArtwork();
    }

    //GET LIST ARTWORK IN USER
    @UserRoles(UserRole.ARTIST, UserRole.COLLECTOR, UserRole.VISITOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Get('in-user')
    getListArtworkInUser() {
        return this.artworkService.getAllArtwork();
    }

    //GET ALL ARTWORK BY USER
    @UserRoles(UserRole.ARTIST, UserRole.COLLECTOR, UserRole.VISITOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Get('other-user/:id')
    getListArtworkByUser(@Param('id') id) {
        return this.artworkService.getAllArtworkByUserId(id);
    }

    //GET ALL ARTWORK BY USER SESSION
    @UserRoles(UserRole.ARTIST, UserRole.COLLECTOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Get('own')
    getListArtworkByUserSesion(@Request() req) {
        const id = req.user.id
        return this.artworkService.getAllArtworkByUserId(id);
    }

    //GET LIST REQUEST VALIDATION ARTWORK TYPE IN ADMIN
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.VALIDATOR)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Get('in-admin/validation-list')
    getValidationListArtworkInAdmin() {
        return this.artworkService.getAllRequestValidationArtwork();
    }

    //GET LIST REQUEST VALIDATION ARTWORK TYPE IN USER
    @UserRoles(UserRole.ARTIST, UserRole.COLLECTOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Get('in-user/validation-list')
    getValidationListArtworkInUser(@Request() req) {
        const id = req.params.id
        return this.artworkService.getAllRequestValidationArtworkByUser(id);
    }

    //GET DETAIL ARTWORK IN ADMIN
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.VALIDATOR)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Get('in-admin/:id')
    getDetailArtworkInAdmin(@Param('id') id) {
        return this.artworkService.getArtworkById(id);
    }

    //GET DETAIL ARTWORK IN USER
    @UserRoles(UserRole.ARTIST, UserRole.COLLECTOR, UserRole.VISITOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Get('in-user/:id')
    getDetailArtwork(@Param('id') id) {
        return this.artworkService.getArtworkById(id);
    }

    //UPDATE ARTWORK
    @UserRoles(UserRole.ARTIST, UserRole.VISITOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Put('update-data/:id')
    async update(@Param('id') id, @Body() artworkData: UpdateArtworkDto) {
        return this.artworkService.update(id, artworkData);
    }

    //UPDATE IMAGE
    @UserRoles(UserRole.ARTIST, UserRole.VISITOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @UseInterceptors(FileInterceptor(
        'image',
        { 
            storage: diskStorage({
                destination: './data/artwork/document/',
                filename: fileNameFormater,
            })
        }
    ))
    @Put('update-image/:id')
    async updateImage(@Param('id') id, @UploadedFile() image: Express.Multer.File) {
        const artwork = await this.artworkService.getArtworkById(id)

        const imageData: UpdateArtworkImageDto = {
            image: image.filename
        }

        if(artwork.image){
            fs.unlink(
                join(process.cwd(), 
                process.env.FINE_ART_TYPE_DATA + artwork.image), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }
        
        return this.artworkService.updateImage(id, imageData)
    }

    //UPDATE VIDEO
    @UserRoles(UserRole.ARTIST, UserRole.VISITOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @UseInterceptors(FileInterceptor(
        'artworkVideo',
        { 
            storage: diskStorage({
                destination: './data/artwork/document/',
                filename: fileNameFormater,
            })
        }
    ))
    @Put('update-video/:id')
    async updateVideo(@Param('id') id, @UploadedFile() video: Express.Multer.File) {
        const artwork = await this.artworkService.getArtworkById(id)

        const videoData: UpdateArtworkVideoDto = {
            artworkVideo: video.filename
        }

        if(artwork.artworkVideo){
            fs.unlink(
                join(process.cwd(), 
                process.env.FINE_ART_TYPE_DATA + artwork.artworkVideo), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }
        
        return this.artworkService.updateVideo(id, videoData)
    }

    //UPDATE CERTIFICATE
    @UserRoles(UserRole.ARTIST, UserRole.VISITOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @UseInterceptors(FileInterceptor(
        'artworkCertificate',
        { 
            storage: diskStorage({
                destination: './data/artwork/document/',
                filename: fileNameFormater,
            })
        }
    ))
    @Put('update-certificate/:id')
    async updateCertificate(@Param('id') id, @UploadedFile() certificate: Express.Multer.File) {
        const artwork = await this.artworkService.getArtworkById(id)

        const certificateData: UpdateArtworkCertificateDto = {
            artworkCertificate: certificate.filename
        }

        if(artwork.artworkCertificate){
            fs.unlink(
                join(process.cwd(), 
                process.env.FINE_ART_TYPE_DATA + artwork.artworkCertificate), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }
        
        return this.artworkService.updateCertificate(id, certificateData)
    }

    //ARTWORK VALIDATION
    @UserRoles(UserRole.ARTIST, UserRole.VISITOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Put('update-location/:id')
    async updateLocation(@Param('id') id, @Body() locationData: UpdateArtworkLocationDto) {
        return this.artworkService.updateLocation(id, locationData);
    }

    //ARTWORK REQUEST VALIDATION
    @UserRoles(UserRole.ARTIST, UserRole.VISITOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Put('request-validation/:id')
    async requestValidation(@Param('id') id) {
        const validationData: ValidationArtworkDto = {
            validationStatus: ValidationStatus.SUBMIT,
            validationNote: ""
        }
        return this.artworkService.updateValidation(id, validationData);
    }

    //ARTWORK VALIDATION
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Put('validation/:id')
    async validation(@Param('id') id, @Body() validationData: ValidationArtworkDto) {
        return this.artworkService.updateValidation(id, validationData);
    }

    //ARTWORK SUSPEND
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Put('suspend/:id')
    async suspendArtwork(@Param('id') id, @Body() suspendData: SuspendArtworkDto) {
        return this.artworkService.suspendArtwork(id, suspendData);
    }

    //DELETE ARTWORK BY ADMIN
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Delete('in-admin/delete/:id')
    async deleteInAdmin(@Param('id') id) {
        const artwork = await this.artworkService.getArtworkById(id)

        if(artwork.image){
            fs.unlink(
                join(process.cwd(), 
                process.env.FINE_ART_TYPE_DATA + artwork.image), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }

        if(artwork.artworkVideo){
            fs.unlink(
                join(process.cwd(), 
                process.env.FINE_ART_TYPE_DATA + artwork.artworkVideo), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }

        if(artwork.artworkCertificate){
            fs.unlink(
                join(process.cwd(), 
                process.env.FINE_ART_TYPE_DATA + artwork.artworkCertificate), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }

        return this.artworkService.delete(id);
    }

    //DELETE ARTWORK BY USER
    @UserRoles(UserRole.ARTIST, UserRole.VISITOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Delete('in-user/delete/:id')
    async deleteInUser(@Param('id') id) {
        const artwork = await this.artworkService.getArtworkById(id)

        if(artwork.image){
            fs.unlink(
                join(process.cwd(), 
                process.env.FINE_ART_TYPE_DATA + artwork.image), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }

        if(artwork.artworkVideo){
            fs.unlink(
                join(process.cwd(), 
                process.env.FINE_ART_TYPE_DATA + artwork.artworkVideo), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }

        if(artwork.artworkCertificate){
            fs.unlink(
                join(process.cwd(), 
                process.env.FINE_ART_TYPE_DATA + artwork.artworkCertificate), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }

        return this.artworkService.delete(id);
    }

    //STREAM ARTWORK DOCUMENT
    @Get('document/:documentName')
    getArtworkTypeImage(@Param('documentName') documentName, @Res() res): Observable<Object>{
        const document = createReadStream(join(process.cwd(), process.env.ARTWORK_DATA  + documentName))
        return document.pipe(res);
    }
}