import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DetailNewsTypeController } from "./detailNewsType.controller";
import { DetailNewsTypeService } from "./detailNewsType.service";
import DetailNewsType from "./detailNewsType.entity";

@Module({
    imports: [TypeOrmModule.forFeature([DetailNewsType])],
    controllers: [DetailNewsTypeController],
    providers: [DetailNewsTypeService]
})
export class DetailNewsTypeModule{}