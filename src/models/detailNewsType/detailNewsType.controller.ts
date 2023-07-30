import { Controller } from "@nestjs/common";
import { DetailNewsTypeService } from "./detailNewsType.service";

@Controller('detail-news-type')
export class DetailNewsTypeController{
    constructor(
        private readonly detailNewsTypeService: DetailNewsTypeService,
    ){}
}