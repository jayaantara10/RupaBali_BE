import { Body, Controller, Delete, Get, Param, Post, Put, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FineArtTypeService } from "./fineArtType.service";
import { CreateFineArtTypeDto } from "./dto/fineArtType.create.dto";
import { AdminRoles, UserRoles } from "src/authentication/auth.decorator";
import { AdminRole } from "src/common/enum/adminRole.enum";
import { JwtGuard } from "src/authentication/guards/jwt.guard";
import { AdminRolesGuard, UserRolesGuard } from "src/authentication/guards/roles.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { fileNameFormater } from "src/common/helper/fileNameFormater.helper";
import { UpdateFineArtTypeDto, UpdateImageFineArtTypeDto } from "./dto/fineArtType.update.dto";
import { createReadStream } from "fs";
import * as fs from 'fs';
import { join } from "path";
import { UserRole } from "src/common/enum/userRole.enum";
import { Observable } from "rxjs";
import { ValidationFineArtTypeDto } from "./dto/fineArtType.validation.dto";

@Controller('fine-art-type')
export class FineArtTypeController{
    constructor(
        private readonly fineArtTypeService: FineArtTypeService,
    ){}

    //CREATE FINE ART TYPE
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @UseInterceptors(FileInterceptor(
        'image',
        { 
            storage: diskStorage({
                destination: './data/fineArtType/image',
                filename: fileNameFormater,
            })
        }
    ))
    @Post()
    async createFineArtType(@Body() fineArtTypeData: CreateFineArtTypeDto, @UploadedFile() image: Express.Multer.File) {
        fineArtTypeData.image = image.filename
        return this.fineArtTypeService.create(fineArtTypeData);
    }

    //GET LIST FINE ART TYPE IN ADMIN
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.VALIDATOR)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Get('in-admin')
    getListFineArtTypeInAdmin() {
        return this.fineArtTypeService.getAllFineArtType();
    }

    //GET LIST FINE ART TYPE IN USER
    @UserRoles(UserRole.VISITOR, UserRole.COLLECTOR, UserRole.ARTIST)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Get('in-user')
    getListFineArtTypeInUser() {
        return this.fineArtTypeService.getAllFineArtType();
    }

    //GET LIST REQUEST VALIDATION FINE ART TYPE IN ADMIN
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.VALIDATOR)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Get('validation-list')
    getValidationListFineArtType() {
        return this.fineArtTypeService.getAllRequestValidationFineArtType();
    }

    //GET DETAIL FINE ART TYPE IN ADMIN
    @AdminRoles(AdminRole.SUPER_ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Get('in-admin/:id')
    getDetailFineArtTypeInAdmin(@Param('id') id) {
        return this.fineArtTypeService.getFineArtTypeById(id);
    }

    //GET DETAIL FINE ART TYPE IN USER
    @UserRoles(UserRole.VISITOR, UserRole.COLLECTOR, UserRole.ARTIST)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Get('in-user/:id')
    getDetailFineArtTypeInUser(@Param('id') id) {
        return this.fineArtTypeService.getFineArtTypeById(id);
    }

    //UPDATE FINE ART TYPE BY ADMIN
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Put('update-data/:id')
    async updateData(@Param('id') id, @Body() fineArtTypeData: UpdateFineArtTypeDto) {
        return this.fineArtTypeService.updateFineArtType(id, fineArtTypeData);
    }

    //UPDATE IMAGE
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @UseInterceptors(FileInterceptor(
        'image',
        { 
            storage: diskStorage({
                destination: './data/fineArtType/image',
                filename: fileNameFormater,
            })
        }
    ))
    @Put('update-image/:id')
    async updateImage(@Param('id') id, @UploadedFile() image: Express.Multer.File) {
        const fineArtType = await this.fineArtTypeService.getFineArtTypeById(id)

        const imageData: UpdateImageFineArtTypeDto = {
            image: image.filename
        }

        if(fineArtType.image){
            fs.unlink(
                join(process.cwd(), 
                process.env.FINE_ART_TYPE_DATA + fineArtType.image), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }
        
        return this.fineArtTypeService.updateImage(id, imageData)
    }

    //UPDATE VALIDATION BY VALIDATOR
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.VALIDATOR)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Put('validation/:id')
    async validationData(@Param('id') id, @Body() validationData: ValidationFineArtTypeDto) {
        return this.fineArtTypeService.updateValidation(id, validationData);
    }

    //DELETE FINE ART TYPE BY ADMIN
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Delete('delete/:id')
    async delete(@Param('id') id) {
        const fineArtType = await this.fineArtTypeService.getFineArtTypeById(id)

        if(fineArtType.image){
            fs.unlink(
                join(process.cwd(), 
                process.env.FINE_ART_TYPE_DATA + fineArtType.image), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }
        return this.fineArtTypeService.deleteFineArtType(id);
    }

    //STREAM FINE ART TYPE IMAGE 
    @Get('image/:imageName')
    getImage(@Param('imageName') imageName, @Res() res): Observable<Object>{
        const image = createReadStream(join(process.cwd(), process.env.FINE_ART_TYPE_DATA  + imageName))
        return image.pipe(res);
    }
}