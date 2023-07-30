import { Body, Controller, Delete, Get, Param, Post, Put, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ArtworkTypeService } from "./artworkType.service";
import { AdminRoles, UserRoles } from "src/authentication/auth.decorator";
import { AdminRole } from "src/common/enum/adminRole.enum";
import { JwtGuard } from "src/authentication/guards/jwt.guard";
import { AdminRolesGuard, UserRolesGuard } from "src/authentication/guards/roles.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { fileNameFormater } from "src/common/helper/fileNameFormater.helper";
import { CreateArtworkTypeDto } from "./dto/artworkType.create.dto";
import { UserRole } from "src/common/enum/userRole.enum";
import { UpdateArtworkTypeDto, UpdateImageArtworkTypeDto } from "./dto/artworkType.update.dto";
import { createReadStream } from "fs";
import * as fs from 'fs';
import { join } from "path";
import { Observable } from "rxjs";
import { ValidationArtworkTypeDto } from "./dto/artworkType.validation.dto";

@Controller('artwork-type')
export class ArtworkTypeController{
    constructor(
        private readonly artworkTypeService: ArtworkTypeService,
    ){}

    //CREATE ARTWORK TYPE
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @UseInterceptors(FileInterceptor(
        'image',
        { 
            storage: diskStorage({
                destination: './data/artworkType/image',
                filename: fileNameFormater,
            })
        }
    ))
    @Post()
    async create(@Body() artworkTypeData: CreateArtworkTypeDto, @UploadedFile() image: Express.Multer.File) {
        artworkTypeData.image = image.filename
        return this.artworkTypeService.create(artworkTypeData);
    }

    //GET LIST ARTWORK TYPE IN ADMIN
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.VALIDATOR)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Get('in-admin')
    getListArtworkTypeInAdmin() {
        return this.artworkTypeService.getAllArtworkType();
    }

    //GET LIST ARTWORK TYPE IN USER
    @UserRoles(UserRole.VISITOR, UserRole.COLLECTOR, UserRole.ARTIST)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Get('in-user')
    getListArtworkTypeInUser() {
        return this.artworkTypeService.getAllArtworkType();
    }

    //GET LIST REQUEST VALIDATION ARTWORK TYPE IN ADMIN
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.VALIDATOR)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Get('validation-list')
    getValidationListArtworkType() {
        return this.artworkTypeService.getAllRequestValidationArtworkType();
    }

    //GET DETAILARTWORK TYPE IN ADMIN
    @AdminRoles(AdminRole.SUPER_ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Get('in-admin/:id')
    getDetailArtworkTypeInAdmin(@Param('id') id) {
        return this.artworkTypeService.getArtworkTypeById(id);
    }

    //GET DETAIL ARTWORK TYPE IN USER
    @UserRoles(UserRole.VISITOR, UserRole.COLLECTOR, UserRole.ARTIST)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Get('in-user/:id')
    getDetailArtworkTypeInUser(@Param('id') id) {
        return this.artworkTypeService.getArtworkTypeById(id);
    }

    //UPDATE ARTWORK TYPE BY ADMIN
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Put('update-data/:id')
    async update(@Param('id') id, @Body() artworkTypeData: UpdateArtworkTypeDto) {
        return this.artworkTypeService.updateArtworkType(id, artworkTypeData);
    }

    //UPDATE IMAGE
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @UseInterceptors(FileInterceptor(
        'image',
        { 
            storage: diskStorage({
                destination: './data/artworkType/image',
                filename: fileNameFormater,
            })
        }
    ))
    @Put('update-image/:id')
    async updateImage(@Param('id') id, @UploadedFile() image: Express.Multer.File) {
        const artworkType = await this.artworkTypeService.getArtworkTypeById(id)

        const imageData: UpdateImageArtworkTypeDto = {
            image: image.filename
        }

        if(artworkType.image){
            fs.unlink(
                join(process.cwd(), 
                process.env.ARTWORK_TYPE_DATA + artworkType.image), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }
        
        return this.artworkTypeService.updateImage(id, imageData)
    }

    //UPDATE VALIDATION BY VALIDATOR
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.VALIDATOR)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Put('validation/:id')
    async validation(@Param('id') id, @Body() validationData: ValidationArtworkTypeDto) {
        return this.artworkTypeService.updateValidation(id, validationData);
    }

    //DELETE ARTWORK TYPE BY ADMIN
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Delete('delete/:id')
    async delete(@Param('id') id) {
        const artworkType = await this.artworkTypeService.getArtworkTypeById(id)

        if(artworkType.image){
            fs.unlink(
                join(process.cwd(), 
                process.env.ARTWORK_TYPE_DATA + artworkType.image), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }

        return this.artworkTypeService.deleteArtworkType(id);
    }

    //STREAM ARTWORK TYPE IMAGE 
    @Get('image/:imageName')
    getImage(@Param('imageName') imageName, @Res() res): Observable<Object>{
        const image = createReadStream(join(process.cwd(), process.env.ARTWORK_TYPE_DATA  + imageName))
        return image.pipe(res);
    }
}