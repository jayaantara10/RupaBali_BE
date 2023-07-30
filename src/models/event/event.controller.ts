import { Body, Controller, Delete, Get, Param, Post, Put, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { EventService } from "./event.service";
import { AdminRoles } from "src/authentication/auth.decorator";
import { AdminRole } from "src/common/enum/adminRole.enum";
import { JwtGuard } from "src/authentication/guards/jwt.guard";
import { AdminRolesGuard } from "src/authentication/guards/roles.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { fileNameFormater } from "src/common/helper/fileNameFormater.helper";
import { CreateEventDto } from "./dto/event.create.dto";
import { UpdateEventDto, UpdateEventImageDto } from "./dto/event.update.dto";
import { createReadStream } from "fs";
import * as fs from 'fs';
import { join } from "path";
import { Observable } from "rxjs";

@Controller('event')
export class EventController{
    constructor(
        private readonly eventService: EventService,
    ){}

    //CREATE EVENT
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @UseInterceptors(FileInterceptor(
        'image',
        { 
            storage: diskStorage({
                destination: './data/event/image/',
                filename: fileNameFormater,
            })
        }
    ))
    @Post()
    async create(@Body() eventData: CreateEventDto, @UploadedFile() image: Express.Multer.File) {
        eventData.images = image.filename
        return this.eventService.create(eventData)
    }
    
    //GET LIST EVENT
    @Get()
    getListEvent() {
        return this.eventService.getAllEvent()
    }

    //GET EVENT DETAILS
    @Get(':id')
    getEventDetail(@Param('id') id) {
        return this.eventService.getEventById(id);
    }

    //UPDATE EVENT
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Put('update/:id')
    async updateEvent(@Param('id') id, @Body() eventData: UpdateEventDto) {
        return this.eventService.update(id, eventData);
    }

    //UPDATE IMAGE
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @UseInterceptors(FileInterceptor(
        'image',
        { 
            storage: diskStorage({
                destination: './data/event/image/',
                filename: fileNameFormater,
            })
        }
    ))
    @Put('update-image/:id')
    async updateImage(@Param('id') id, @UploadedFile() image: Express.Multer.File) {
        const event = await this.eventService.getEventById(id)

        const imageData: UpdateEventImageDto = {
            image: image.filename
        }

        if(event.image){
            fs.unlink(
                join(process.cwd(), 
                process.env.EVENT_DATA + event.image), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }
        
        return this.eventService.updateImage(id, imageData)
    }

    //DELETE EVENT
    @AdminRoles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Delete('delete/:id')
    async delete(@Param('id') id) {
        const event = await this.eventService.getEventById(id)

        if(event.image){
            fs.unlink(
                join(process.cwd(), 
                process.env.EVENT_DATA + event.image), 
                (error) => {
                    if (error) {
                        console.error(error);
                        return error;
                    }
                }
            )
        }

        return this.eventService.delete(id)
    }

    //STREAM EVENT IMAGE
    @Get('image/:imageName')
    getImage(@Param('imageName') imageName, @Res() res): Observable<Object>{
        const image = createReadStream(join(process.cwd(), process.env.EVENT_DATA  + imageName))
        return image.pipe(res);
    }
}