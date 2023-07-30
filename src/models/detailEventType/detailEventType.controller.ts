import { Controller } from "@nestjs/common";
import { DetailEventTypeService } from "./detailEventType.service";

@Controller('detail-event-type')
export class DetailEventTypeController{
    constructor(
        private readonly detailEventTypeService: DetailEventTypeService,
    ){}
}