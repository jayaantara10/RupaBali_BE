import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import ArtworkType from "./artworkType.entity";
import { ArtworkTypeController } from "./artworkType.controller";
import { ArtworkTypeService } from "./artworkType.service";

@Module({
    imports: [TypeOrmModule.forFeature([ArtworkType])],
    controllers: [ArtworkTypeController],
    providers: [ArtworkTypeService]
})
export class ArtworkTypeModule{}