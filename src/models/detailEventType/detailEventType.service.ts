import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import DetailEventType from "./detailEventType.entity";
import { CreateDetailEventTypeDto } from "./dto/detailEventType.create.dto";
import { HttpException, HttpStatus } from "@nestjs/common";

export class DetailEventTypeService{
    constructor(
        @InjectRepository(DetailEventType) private detailEventTypeRepository: Repository<DetailEventType>,
    ){}
}