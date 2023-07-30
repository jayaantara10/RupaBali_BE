import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import DetailNewsType from "./detailNewsType.entity";
import { HttpException, HttpStatus } from "@nestjs/common";
import { CreateDetailNewsTypeDto } from "./dto/detailNewsType.create.dto";

export class DetailNewsTypeService{
    constructor(
        @InjectRepository(DetailNewsType) private detailNewsTypeRepository: Repository<DetailNewsType>,
    ){}
    
}