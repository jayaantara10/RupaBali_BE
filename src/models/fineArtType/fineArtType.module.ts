import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FineArtTypeController } from "./fineArtType.controller";
import { FineArtTypeService } from "./fineArtType.service";
import FineArtType from "./fineArtType.entity";

@Module({
    imports: [TypeOrmModule.forFeature([FineArtType])],
    controllers: [FineArtTypeController],
    providers: [FineArtTypeService]
})
export class FineArtTypeModule{}