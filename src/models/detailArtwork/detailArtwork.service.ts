import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import DetailArtwork from "./detailArtwork.enity";
import { CreateDetailArtworkDto } from "./dto/detailArtwork.create.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import { UpdateDetailArtworkDto, UpdateDetailArtworkImageDto } from "./dto/detailArtwork.update.dto";

export class DetailArtworkService{
    constructor(
        @InjectRepository(DetailArtwork) private detailArtworkRepository: Repository<DetailArtwork>,
    ){}
    
    //CREATE DETAIL ARTWORK
    async create(detailArtworkData: CreateDetailArtworkDto) {
        try {
            await this.detailArtworkRepository.save(detailArtworkData)

            const response = {
                message: 'Success'
            }

            return response

        } catch (error) {
            console.log(error.message)
            throw new HttpException(error.message, error.status)
        }
    }

    //GET ALL DETAIL ARTWORK BY ARTWORK
    async getAllDetailArtworkByArtwork(id: string) {
        try{
            const detailsArtwork = await this.detailArtworkRepository.find({
                where: {
                    id: id
                },
                order: {
                    createdAt: 'ASC',
                }
            })
            return detailsArtwork

        } catch (error) {
            console.log(error.message)
            throw new HttpException(error.message, error.status)
        }
    }

    //GET DETAIL ARTWORK
    async getDetailArtworkById(id: string){
        try {
            const detailArtwork = await this.detailArtworkRepository.findOne({
                where: {
                    id: id,
                }
            })
    
            if (detailArtwork) {
                return detailArtwork
            }
    
            throw new HttpException('Detail Artwork not found', HttpStatus.NOT_FOUND)
        } catch (error) {
            console.log(error.message)
            throw new HttpException(error.message, error.status)
        }
    }


    //UPDATE DETAIL ARTWORK
    async update(id: string, detailArtworkData: UpdateDetailArtworkDto) {
        try {
            const updateDetailArtwork = await this.detailArtworkRepository.update(id, detailArtworkData)

            if(!updateDetailArtwork.affected){
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

    //UPDATE DETAIL ARTWORK IMAGE
    async updateImage(id: string, imageData: UpdateDetailArtworkImageDto) {
        try {
            const updateDetailArtwork = await this.detailArtworkRepository.update(id, imageData)

            if(!updateDetailArtwork.affected){
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

    //DELETE DETAIL ARTWORK
    async deleteDetailArtwork(id: string) {
        try {
            const deleteAchievement = await this.detailArtworkRepository.delete(id);
            if (!deleteAchievement.affected) {
                throw new HttpException('Detail Artwork not found', HttpStatus.NOT_FOUND)
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