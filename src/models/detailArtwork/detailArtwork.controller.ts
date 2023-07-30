import { Body, Controller, Delete, Get, Param, Post, Put, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { DetailArtworkService } from "./detailArtwork.service";
import { AdminRoles, UserRoles } from "src/authentication/auth.decorator";
import { UserRole } from "src/common/enum/userRole.enum";
import { JwtGuard } from "src/authentication/guards/jwt.guard";
import { UserRolesGuard } from "src/authentication/guards/roles.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { fileNameFormater } from "src/common/helper/fileNameFormater.helper";
import { CreateDetailArtworkDto } from "./dto/detailArtwork.create.dto";
import { UpdateDetailArtworkDto, UpdateDetailArtworkImageDto } from "./dto/detailArtwork.update.dto";
import { createReadStream } from "fs";
import * as fs from 'fs';
import { join } from "path";
import { Observable } from "rxjs";
import { AdminRole } from "src/common/enum/adminRole.enum";

@Controller('detail-artwork')
export class DetailArtworkController{
    constructor(
        private readonly detailArtworkService: DetailArtworkService,
    ){}

    //CREATE DETAIL ARTWORK
    @UserRoles(UserRole.ARTIST, UserRole.COLLECTOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @UseInterceptors(FileInterceptor(
        'image',
        { 
            storage: diskStorage({
                destination: './data/artworkDetail/image/',
                filename: fileNameFormater,
            })
        }
    ))
    @Post()
    async createArtwork(@Body() detailArtworkData: CreateDetailArtworkDto, @UploadedFile() image: Express.Multer.File) {
        detailArtworkData.image = image.filename
        return this.detailArtworkService.create(detailArtworkData)
    }
    
    //GET LIST DETAIL ARTWORK BY ARTWORK IN USER
    @UserRoles(UserRole.ARTIST, UserRole.COLLECTOR, UserRole.VISITOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Get('in-user/by-artwork/:id')
    getAllDetailArtworkInUser(@Param('id') id) {
        return this.detailArtworkService.getAllDetailArtworkByArtwork(id)
    }

    //GET LIST DETAIL ARTWORK BY ARTWORK IN ADMIN
    @AdminRoles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN, AdminRole.VALIDATOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Get('in-admin/by-artwork/:id')
    getAllDetailArtworkInAdmin(@Param('id') id) {
        return this.detailArtworkService.getAllDetailArtworkByArtwork(id)
    }

    //GET DETAIL ARTWORK BY ID IN USER
    @UserRoles(UserRole.ARTIST, UserRole.COLLECTOR, UserRole.VISITOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Get('in-user/:id')
    getDetailArtworkByIdInUser(@Param('id') id) {
        return this.detailArtworkService.getDetailArtworkById(id);
    }

    //GET DETAIL ARTWORK BY ID IN ADMIN
    @AdminRoles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN, AdminRole.VALIDATOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Get('in-admin/:id')
    getDetailArtworkByIdInAdmin(@Param('id') id) {
        return this.detailArtworkService.getDetailArtworkById(id);
    }

    //UPDATE DETAIL ARTWORK
    @UserRoles(UserRole.ARTIST, UserRole.VISITOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Put('update-data/:id')
    async update(@Param('id') id, @Body() detailArtworkData: UpdateDetailArtworkDto) {
        return this.detailArtworkService.update(id, detailArtworkData);
    }

    //UPDATE IMAGE
    @UserRoles(UserRole.ARTIST, UserRole.VISITOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @UseInterceptors(FileInterceptor(
        'image',
        { 
            storage: diskStorage({
                destination: './data/artworkDetail/image/',
                filename: fileNameFormater,
            })
        }
    ))
    @Put('update-image/:id')
    async updateImage(@Param('id') id, @UploadedFile() image: Express.Multer.File) {
        const detailArtwork = await this.detailArtworkService.getDetailArtworkById(id)

        const imageData: UpdateDetailArtworkImageDto = {
            image: image.filename
        }

        if(detailArtwork.image){
            fs.unlink(
                join(process.cwd(), 
                process.env.ARTWORK_TYPE_DATA + detailArtwork.image), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }
        
        return this.detailArtworkService.updateImage(id, imageData)
    }

    //DELETE ACHIEVEMENT
    @UserRoles(UserRole.ARTIST, UserRole.VISITOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Delete('/in-user/delete/:id')
    async delete(@Param('id') id) {
        const detailArtwork = await this.detailArtworkService.getDetailArtworkById(id)

        if(detailArtwork.image){
            fs.unlink(
                join(process.cwd(), 
                process.env.ARTWORK_TYPE_DATA + detailArtwork.image), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }
        return this.detailArtworkService.deleteDetailArtwork(id);
    }

    //STREAM DETAIL ARTWORK IMAGE
    @Get('image/:imageName')
    getImage(@Param('imageName') imageName, @Res() res): Observable<Object>{
        const image = createReadStream(join(process.cwd(), process.env.ARTWORK_DETAIL_DATA  + imageName))
        return image.pipe(res);
    }
}