import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import ArtworkType from "./artworkType.entity";
import { CreateArtworkTypeDto } from "./dto/artworkType.create.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import { ValidationStatus } from "src/common/enum/validationStatus.enum";
import { ValidationArtworkTypeDto } from "./dto/artworkType.validation.dto";
import { UpdateArtworkTypeDto, UpdateImageArtworkTypeDto } from "./dto/artworkType.update.dto";

export class ArtworkTypeService{
    constructor(
        @InjectRepository(ArtworkType) private artworkTypeRepository: Repository<ArtworkType>,
    ){}

    //CREATE ARTWORK TYPE
    async create(artworkTypeData: CreateArtworkTypeDto) {
        try {
            const isArtworkTypeExist = await this.isArtworkTypeExist(artworkTypeData.type)

            if(!isArtworkTypeExist) {

                await this.artworkTypeRepository.save(artworkTypeData)

                const response = {
                    message: 'Success'
                }
    
                return response
            }

            throw new HttpException('Artwork Type already exist', HttpStatus.FORBIDDEN)

        } catch (error) {
            console.log(error.message)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }

    //CHECK ARTWORK TYPE IS EXIST
    async isArtworkTypeExist(type: string) {
        try {
            const isExist = await this.artworkTypeRepository.findOne({
                where: {
                    type: type
                }
            })

            if (isExist) {
                return true
            }

            return false

        }catch (error) {
            console.log(error.message)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }

    //GET ALL ARTWORK TYPE
    async getAllArtworkType() {
        try{
            const artworkTypes = await this.artworkTypeRepository.find({
                where: {
                    validationStatus: ValidationStatus.VALID
                },
                order: {
                    id: 'ASC',
                }
            });
            return artworkTypes

        } catch (error) {
            console.log(error.message)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }

    //GET ARTWORK TYPE BY id
    async getArtworkTypeById(id: string){
        try {
            const artworkType = await this.artworkTypeRepository.findOne({
                where: {
                    id: id,
                }
            });
    
            if (artworkType) {
                return artworkType
            }
    
            throw new HttpException('Artwork Type not found', HttpStatus.NOT_FOUND)
        } catch (error) {
            console.log(error.message)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }

    //GET ALL REQUEST VALIDATION ARTWORK TYPE
    async getAllRequestValidationArtworkType() {
        try{
            const artworkTypes = await this.artworkTypeRepository.find({
                where: [
                    { validationStatus: ValidationStatus.SUBMIT},
                    { validationStatus: ValidationStatus.DENIED }
                ],
                order: {
                    updatedAt: 'ASC',
                }
            });
            return artworkTypes;

        } catch (error) {
            console.log(error.message);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }

    //UPDATE ARTWORK TYPE
    async updateArtworkType(id: string, artworkTypeData: UpdateArtworkTypeDto) {
        try{
            const updateArtworkType = await this.artworkTypeRepository.update(id, artworkTypeData)

            if (!updateArtworkType.affected){
                throw new HttpException('Update Failed', HttpStatus.EXPECTATION_FAILED)
            } else {
                const validationData: ValidationArtworkTypeDto = {
                    validationStatus: ValidationStatus.SUBMIT,
                    validationNote: ""
                }
    
                await this.artworkTypeRepository.update(id, validationData)

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

    //UPDATE IMAGE
    async updateImage(id: string, imageData: UpdateImageArtworkTypeDto) {
        try {
            const updateArtworkType = await this.artworkTypeRepository.update(id, imageData)

            if (!updateArtworkType.affected){
                throw new HttpException('Update Failed', HttpStatus.EXPECTATION_FAILED)
            } else {
                const validationData: ValidationArtworkTypeDto = {
                    validationStatus: ValidationStatus.SUBMIT,
                    validationNote: ""
                }

                await this.artworkTypeRepository.update(id, validationData)
                
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

    //UPDATE VALIDATION
    async updateValidation(id: string, validationData: ValidationArtworkTypeDto) {
        try {
            const updateArtworkType = await this.artworkTypeRepository.update(id, validationData)
            
            if (!updateArtworkType.affected){
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

    //DELETE ARTWORK TYPE
    async deleteArtworkType(id: string) {
        try {
            const deleteArtworkType = await this.artworkTypeRepository.delete(id)
            if (!deleteArtworkType.affected) {
                throw new HttpException('Artwork Type not found', HttpStatus.NOT_FOUND)
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