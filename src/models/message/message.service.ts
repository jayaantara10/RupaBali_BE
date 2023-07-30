import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Message from "./message.entity";

export class MessageService{
    constructor(
        @InjectRepository(Message) private messageRepository: Repository<Message>,
    ){}
    
}