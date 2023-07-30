import { InjectRepository } from "@nestjs/typeorm";
import AchievementArtwork from "./achievementArtwork.entity";
import { Repository } from "typeorm";
import { CreateAchievementArtworkDto } from "./dto/achievementArtwork.create.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import { UpdateAchievementArtworkDto, UpdateAchievementCertificateDto, UpdateAchievementDocumentationDto } from "./dto/achievementArtwork.update.dto";

export class AchievementArtworkService{
    constructor(
        @InjectRepository(AchievementArtwork) private achievementRepository: Repository<AchievementArtwork>,
    ){}
    
    //CREATE ACHIEVEMENT
    async create(achievementData: CreateAchievementArtworkDto) {
        try {
            await this.achievementRepository.save(achievementData)

            const response = {
                message: 'Success'
            }

            return response

        } catch (error) {
            console.log(error.message);
            throw new HttpException(error.message, error.status)
        }
    }

    //GET ALL ACHIEVEMENT ARTWORK BY ARTWORK
    async getAllAchievementByArtwork(id: string) {
        try{
            const achievements = await this.achievementRepository.find({
                where: {
                    id: id
                },
                order: {
                    dateAchievement: 'ASC',
                }
            });
            return achievements

        } catch (error) {
            console.log(error.message)
            throw new HttpException(error.message, error.status)
        }
    }

    //GET ACHIEVEMENT BY id
    async getAchievementById(id: string){
        try {
            const achievement = await this.achievementRepository.findOne({
                where: {
                    id: id,
                }
            })
    
            if (achievement) {
                return achievement
            }
    
            throw new HttpException('Achievement not found', HttpStatus.NOT_FOUND);
        } catch (error) {
            console.log(error.message)
            throw new HttpException(error.message, error.status)
        }
    }

    //UPDATE ACHIEVEMENT
    async update(id: string, achievementData: UpdateAchievementArtworkDto) {
        try {
            const updateAchievement = await this.achievementRepository.update(id, achievementData)

            if(!updateAchievement.affected){
                throw new HttpException('Update Failed', HttpStatus.NOT_FOUND)
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

    //UPDATE DOCUMENTATION
    async updateDocumentation(id: string, documentationData: UpdateAchievementDocumentationDto) {
        try {
            const updateAchievement = await this.achievementRepository.update(id, documentationData)

            if(!updateAchievement.affected){
                throw new HttpException('Update Failed', HttpStatus.NOT_FOUND)
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

    //UPDATE CERTIFICATE
    async updateCertificate(id: string, certificateData: UpdateAchievementCertificateDto) {
        try {
            const updateAchievement = await this.achievementRepository.update(id, certificateData)

            if(!updateAchievement.affected){
                throw new HttpException('Update Failed', HttpStatus.NOT_FOUND)
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

    //DELETE ACHIEVEMENT
    async delete(id: string) {
        try {
            const deleteAchievement = await this.achievementRepository.delete(id)
            if (!deleteAchievement.affected) {
                throw new HttpException('Achievement not found', HttpStatus.NOT_FOUND)
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