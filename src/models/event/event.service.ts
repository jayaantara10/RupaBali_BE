import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Event from "./event.entity";
import { CreateEventDto } from "./dto/event.create.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import { UpdateEventDto, UpdateEventImageDto } from "./dto/event.update.dto";

export class EventService{
    constructor(
        @InjectRepository(Event) private eventRepository: Repository<Event>,
    ){}
    
    //CREATE EVENT
    async create(eventData: CreateEventDto) {
        try {
            await this.eventRepository.save(eventData);

            const response = {
                message: 'Success'
            }

            return response

        } catch (error) {
            console.log(error.message)
            throw new HttpException(error.message, error.status)
        }
    }

    //GET ALL EVENT
    async getAllEvent() {
        try{
            const events = await this.eventRepository.find({
                order: {
                    updatedAt: 'ASC',
                }
            });
            return events

        } catch (error) {
            console.log(error.message)
            throw new HttpException(error.message, error.status)
        }
    }

    //GET EVENT BY id
    async getEventById(id: string){
        try {
            const event = await this.eventRepository.findOne({
                where: {
                    id: id,
                }
            })
    
            if (event) {
                return event
            }
    
            throw new HttpException('Event not found', HttpStatus.NOT_FOUND)
        } catch (error) {
            console.log(error.message)
            throw new HttpException(error.message, error.status)
        }
    }


    //UPDATE EVENT
    async update(id: string, event: UpdateEventDto) {
        try {
            const updateEvent = await this.eventRepository.update(id, event)
            if (!updateEvent.affected) {
                throw new HttpException('Update Failed', HttpStatus.EXPECTATION_FAILED)
            } else {
                const response = {
                    message: 'Success'
                }
    
                return response
            }

        } catch (error) {
            console.log(error.message)
            throw new HttpException(error.message, error.status)
        }
    }

    //UPDATE EVENT IMAGE
    async updateImage(id: string, imageData: UpdateEventImageDto) {
        try {
            const updateEvent = await this.eventRepository.update(id, imageData)
            if (!updateEvent.affected) {
                throw new HttpException('Update Failed', HttpStatus.EXPECTATION_FAILED)
            } else {
                const response = {
                    message: 'Success'
                }
    
                return response
            }

        } catch (error) {
            console.log(error.message)
            throw new HttpException(error.message, error.status)
        }
    }

    //DELETE EVENT
    async delete(id: string) {
        try {
            const deleteEvent = await this.eventRepository.delete(id);
            if (!deleteEvent.affected) {
                throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
            } else {
                const response = {
                    message: 'Success'
                }
    
                return response
            }
        } catch (error) {
            console.log(error.message)
            throw new HttpException(error.message, error.status)
        }
        
    }
}