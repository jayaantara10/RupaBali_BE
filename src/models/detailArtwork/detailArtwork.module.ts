import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DetailArtworkController } from "./detailArtwork.controller";
import { DetailArtworkService } from "./detailArtwork.service";
import DetailArtwork from "./detailArtwork.enity";

@Module({
    imports: [TypeOrmModule.forFeature([DetailArtwork])],
    controllers: [DetailArtworkController],
    providers: [DetailArtworkService]
})
export class DetailArtworkModule{}