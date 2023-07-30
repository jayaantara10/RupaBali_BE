import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OwnershipHistoryService } from "./ownershipHistory.service";
import { OwnershipHistoryController } from "./ownershipHIstory.controller";
import OwnershipHistory from "./ownershipHistory.entity";

@Module({
    imports: [TypeOrmModule.forFeature([OwnershipHistory])],
    controllers: [OwnershipHistoryController],
    providers: [OwnershipHistoryService]
})
export class OwnershipHistoryModule{}