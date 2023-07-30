import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DetailEventTypeController } from "./detailEventType.controller";
import { DetailEventTypeService } from "./detailEventType.service";
import DetailEventType from "./detailEventType.entity";

@Module({
    imports: [TypeOrmModule.forFeature([DetailEventType])],
    controllers: [DetailEventTypeController],
    providers: [DetailEventTypeService]
})
export class DetailEventTypeModule{}