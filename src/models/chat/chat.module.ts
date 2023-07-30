import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import Chat from "./chat.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Chat])],
    controllers: [ChatController],
    providers: [ChatService]
})
export class ChatModule{}