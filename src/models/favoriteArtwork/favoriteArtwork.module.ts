import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FavoriteArtworkController } from "./favoriteArtwork.controller";
import { FavoriteArtworkService } from "./favoriteArtwork.service";
import FavoriteArtwork from "./favoriteArtwork.entity";

@Module({
    imports: [TypeOrmModule.forFeature([FavoriteArtwork])],
    controllers: [FavoriteArtworkController],
    providers: [FavoriteArtworkService]
})
export class FavoriteArtworkModule{}