import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import FineArtType from "./fineArtType.entity";
import { CreateFineArtTypeDto } from "./dto/fineArtType.create.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import { ValidationStatus } from "src/common/enum/validationStatus.enum";
import { UpdateFineArtTypeDto, UpdateImageFineArtTypeDto } from "./dto/fineArtType.update.dto";
import { ValidationFineArtTypeDto } from "./dto/fineArtType.validation.dto";

export class FineArtTypeService{
    constructor(
        @InjectRepository(FineArtType) private fineArtTypeRepository: Repository<FineArtType>,
    ){}

    //CREATE FINE ART TYPE
    async create(fineArtTypeData: CreateFineArtTypeDto) {
        try {
            const isFineArtTypeExist = await this.isFineArtTypeExist(fineArtTypeData.type)

            if(!isFineArtTypeExist) {

                await this.fineArtTypeRepository.save(fineArtTypeData)

                const response = {
                    message: 'Success'
                }
    
                return response
            }

            throw new HttpException('Fine Art Type already exist', HttpStatus.FORBIDDEN)

        } catch (error) {
            console.log(error.message)
            throw new HttpException(error.message, error.status)
        }
    }

    //CHECK FINE ART TYPE IS EXIST
    async isFineArtTypeExist(type: string) {
        try {
            const isExist = await this.fineArtTypeRepository.findOne({
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
            throw new HttpException(error.message, error.status)
        }
    }

    //GET ALL FINE ART TYPE
    async getAllFineArtType() {
        try{
            const fineArtTypes = await this.fineArtTypeRepository.find({
                where: {
                    validationStatus: ValidationStatus.VALID
                },
                order: {
                    id: 'ASC',
                }
            })

            return fineArtTypes

        } catch (error) {
            console.log(error.message)
            throw new HttpException(error.message,  error.status)
        }
    }

    //GET FINE ART TYPE BY id
    async getFineArtTypeById(id: string){
        try {
            const fineArtType = await this.fineArtTypeRepository.findOne({
                where: {
                    id: id,
                }
            });
    
            if (fineArtType) {
                return fineArtType
            }
    
            throw new HttpException('Fine Art Type not found', HttpStatus.NOT_FOUND);
        } catch (error) {
            console.log(error.message);
            throw new HttpException(error.message,  error.status)
        }
    }

    //GET ALL REQUEST VALIDATION FINE ART TYPE
    async getAllRequestValidationFineArtType() {
        try{
            const fineArtTypes = await this.fineArtTypeRepository.find({
                where: [
                    { validationStatus: ValidationStatus.SUBMIT},
                    { validationStatus: ValidationStatus.DENIED }
                ],
                order: {
                    updatedAt: 'ASC',
                }
            });
            return fineArtTypes

        } catch (error) {
            console.log(error.message);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
        }
    }

    //UPDATE FINE ART TYPE
    async updateFineArtType(id: string, fineArtType: UpdateFineArtTypeDto) {
        try{
            const updateFineArtType = await this.fineArtTypeRepository.update(id, fineArtType);

            if (!updateFineArtType.affected){
                throw new HttpException('Update Failed', HttpStatus.EXPECTATION_FAILED)
            } else {
                const validationData: ValidationFineArtTypeDto = {
                    validationStatus: ValidationStatus.SUBMIT,
                    validationNote: ""
                }

                await this.fineArtTypeRepository.update(id, validationData)

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
    async updateImage(id: string, imageData: UpdateImageFineArtTypeDto) {
        try {
            const updateFineArtType = await this.fineArtTypeRepository.update(id, imageData)

            if (!updateFineArtType.affected){
                throw new HttpException('Update Failed', HttpStatus.EXPECTATION_FAILED)
            } else {
                const validationData: ValidationFineArtTypeDto = {
                    validationStatus: ValidationStatus.SUBMIT,
                    validationNote: ""
                }

                await this.fineArtTypeRepository.update(id, validationData)
                
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
    async updateValidation(id: string, validationData: ValidationFineArtTypeDto) {
        try {
            const updateFineArtType = await this.fineArtTypeRepository.update(id, validationData)

            if (!updateFineArtType.affected){
                throw new HttpException('Update Failed', HttpStatus.EXPECTATION_FAILED);
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

    //DELETE FINE ART TYPE
    async deleteFineArtType(id: string) {
        try {
            const deleteFineArtType = await this.fineArtTypeRepository.delete(id);
            if (!deleteFineArtType.affected) {
                throw new HttpException('Fine Art Type not found', HttpStatus.NOT_FOUND);
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