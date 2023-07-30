import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Chat from "./chat.entity";

export class ChatService{
    constructor(
        @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    ){}
    
}