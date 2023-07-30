import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Artwork from "./artwork.entity";
import { ArtworkController } from "./artwork.controller";
import { ArtworkService } from "./artwork.service";

@Module({
    imports: [TypeOrmModule.forFeature([Artwork])],
    controllers: [ArtworkController],
    providers: [ArtworkService]
})
export class ArtworkModule{}