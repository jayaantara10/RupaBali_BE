import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import OwnershipHistory from "./ownershipHistory.entity";
import { CreateOwnershipHistoryDto } from "./dto/ownershipHistory.create.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import { UpdateOwnershipHistoryDto } from "./dto/ownershipHistory.update.dto";

export class OwnershipHistoryService{
    constructor(
        @InjectRepository(OwnershipHistory) private ownershipHistoryRepository: Repository<OwnershipHistory>,
    ){}
    
    //CREATE OWNERSHIP HISTORY
    async create(ownershipHistoryData: CreateOwnershipHistoryDto) {
        try {
            await this.ownershipHistoryRepository.save(ownershipHistoryData)

            const response = {
                message: 'Success'
            }

            return response

        } catch (error) {
            console.log(error.message)
            throw new HttpException(error.message, error.status)
        }
    }

    //GET ALL OWNERSHIP HISTORY BY ARTWORK
    async getAllOwnershipHistory(id: string) {
        try{
            const ownershipHistoris = await this.ownershipHistoryRepository.find({
                where: {
                    artworkId: id
                },
                order: {
                    updatedAt: 'ASC',
                }
            })
            return ownershipHistoris

        } catch (error) {
            console.log(error.message);
            throw new HttpException(error.message, error.status)
        }
    }

    //GET OWNERSHIP HISTORY BY id
    async getOwnershipHistoryById(id: string){
        try {
            const ownershipHistory = await this.ownershipHistoryRepository.findOne({
                where: {
                    id: id,
                }
            })
    
            if (ownershipHistory) {
                return ownershipHistory
            }
    
            throw new HttpException('Ownership Historyt not found', HttpStatus.NOT_FOUND);
        } catch (error) {
            console.log(error.message);
            throw new HttpException(error.message, error.status)
        }
    }


    //UPDATE OWNERSHIP HISTORY
    async update(id: string, ownershipHistoryData: UpdateOwnershipHistoryDto) {
        try {
            const updateOwnershipHistory = await this.ownershipHistoryRepository.update(id, ownershipHistoryData)
            if(!updateOwnershipHistory.affected){
                throw new HttpException('Update Failed', HttpStatus.NOT_FOUND)
            } else {
                const response = {
                    message: 'Success'
                }
    
                return response
            }
        } catch (error) {
            console.log(error.message);
            throw new HttpException(error.message, error.status)
        }
    }

    //DELETE OWNERSHIP HISTORY
    async delete(id: string) {
        try {
            const deleteOwnershipHistory = await this.ownershipHistoryRepository.delete(id);
            if (!deleteOwnershipHistory.affected) {
                throw new HttpException('Ownership History not found', HttpStatus.NOT_FOUND);
            } else {
                const response = {
                    message: 'Success'
                }
    
                return response
            }
        } catch (error) {
            console.log(error.message);
            throw new HttpException(error.message, error.status)
        }
    }
}