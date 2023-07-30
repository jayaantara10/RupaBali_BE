import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { FavoriteArtworkService } from "./favoriteArtwork.service";
import { UserRoles } from "src/authentication/auth.decorator";
import { UserRole } from "src/common/enum/userRole.enum";
import { JwtGuard } from "src/authentication/guards/jwt.guard";
import { UserRolesGuard } from "src/authentication/guards/roles.guard";
import { CreateFavoriteArtworkDto } from "./dto/favoriteArtwork.create.dto";

@Controller('favorite-artwork')
export class FavoriteArtworkController{
    constructor(
        private readonly favoriteArtworkService: FavoriteArtworkService,
    ){}

    //CREATE FAVORITE
    @UserRoles(UserRole.ARTIST, UserRole.COLLECTOR, UserRole.VISITOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Post()
    async create(@Body() favoriteArtworkData: CreateFavoriteArtworkDto) {
        return this.favoriteArtworkService.create(favoriteArtworkData)
    }
    
    //GET LIST FAVORITE BY USER
    @Get(':id')
    getListFavoriteArtwork(@Param('id') id) {
        return this.favoriteArtworkService.getAllFavoriteArtwork(id)
    }

    //DELETE FAVORITE
    @UserRoles(UserRole.ARTIST, UserRole.COLLECTOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Delete('delete/:id')
    async delete(@Param('id') id) {
        return this.favoriteArtworkService.delete(id);
    }
}