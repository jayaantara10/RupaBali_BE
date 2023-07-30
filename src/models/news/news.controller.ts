import { Body, Controller, Delete, Get, Param, Post, Put, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { NewsService } from "./news.service";
import { AdminRoles } from "src/authentication/auth.decorator";
import { AdminRole } from "src/common/enum/adminRole.enum";
import { JwtGuard } from "src/authentication/guards/jwt.guard";
import { AdminRolesGuard } from "src/authentication/guards/roles.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { fileNameFormater } from "src/common/helper/fileNameFormater.helper";
import { CreateNewsDto } from "./dto/news.create.dto";
import { Observable } from "rxjs";
import { createReadStream } from "fs";
import * as fs from 'fs';
import { join } from "path";
import { UpdateNewsDto, UpdateNewsImageDto } from "./dto/news.update.dto";


@Controller('news')
export class NewsController{
    constructor(
        private readonly newsService: NewsService,
    ){}

    //CREATE NEWS
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @UseInterceptors(FileInterceptor(
        'image',
        { 
            storage: diskStorage({
                destination: './data/news/image/',
                filename: fileNameFormater,
            })
        }
    ))
    @Post()
    async create(@Body() newsData: CreateNewsDto, @UploadedFile() image: Express.Multer.File) {
        newsData.images = image.filename
        return this.newsService.create(newsData)
    }
    
    //GET LIST NEWS
    @Get()
    getListNews() {
        return this.newsService.getAllNews()
    }

    //GET NEWS DETAILS
    @Get(':id')
    getNewsDetail(@Param('id') id) {
        return this.newsService.getNewsById(id);
    }

    //UPDATE NEWS
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Put('update/:id')
    async update(@Param('id') id, @Body() newsData: UpdateNewsDto) {
        return this.newsService.update(id, newsData);
    }

    //UPDATE IMAGE
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @UseInterceptors(FileInterceptor(
        'image',
        { 
            storage: diskStorage({
                destination: './data/news/image/',
                filename: fileNameFormater,
            })
        }
    ))
    @Put('update-image/:id')
    async updateImage(@Param('id') id, @UploadedFile() image: Express.Multer.File) {
        const news = await this.newsService.getNewsById(id)

        const imageData: UpdateNewsImageDto = {
            image: image.filename
        }

        if(news.image){
            fs.unlink(
                join(process.cwd(), 
                process.env.NEWS_DATA + news.image), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }
        
        return this.newsService.updateImage(id, imageData)
    }

    //DELETE NEWS
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Delete('delete/:id')
    async delete(@Param('id') id) {
        const news = await this.newsService.getNewsById(id)

        if(news.image){
            fs.unlink(
                join(process.cwd(), 
                process.env.NEWS_DATA + news.image), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }

        return this.newsService.delete(id);
    }

    //STREAM NEWS IMAGE
    @Get('image/:imageName')
    getImage(@Param('imageName') imageName, @Res() res): Observable<Object>{
        const image = createReadStream(join(process.cwd(), process.env.NEWS_DATA  + imageName))
        return image.pipe(res);
    }
}