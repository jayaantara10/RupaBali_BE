import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Artwork from "./artwork.entity";
import { CreateArtworkDto } from "./dto/artwork.create.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import { ValidationStatus } from "src/common/enum/validationStatus.enum";
import { UpdateArtworkTypeDto } from "../artworkType/dto/artworkType.update.dto";
import { ValidationArtworkDto } from "./dto/artwork.validation.dto";
import { UpdateArtworkCertificateDto, UpdateArtworkDto, UpdateArtworkImageDto, UpdateArtworkLocationDto, UpdateArtworkVideoDto } from "./dto/artwork.update.dto";
import { SuspendArtworkDto } from "./dto/artwork.suspend.dto";

export class ArtworkService{
    constructor(
        @InjectRepository(Artwork) private artworkRepository: Repository<Artwork>,
    ){}

    //CREATE ARTWORK
    async create(artworkData: CreateArtworkDto) {
        try {
            await this.artworkRepository.save(artworkData)

            const response = {
                message: 'Success'
            }

            return response

        } catch (error) {
            console.log(error.message)
            throw new HttpException(error.message, error.status)
        }
    }

    //GET ALL ARTWORK
    async getAllArtwork() {
        try{
            const artworks = await this.artworkRepository.find({
                where: {
                    validationStatus: ValidationStatus.VALID
                },
                order: {
                    updatedAt: 'ASC',
                }
            });

            return artworks

        } catch (error) {
            console.log(error.message)
            throw new HttpException(error.message, error.status)
        }
    }

    //GET ALL ARTWORK BY USER ID
    async getAllArtworkByUserId(id:string) {
        try{
            const artworks = await this.artworkRepository.find({
                where: {
                    userId: id,
                    validationStatus: ValidationStatus.VALID
                },
                order: {
                    updatedAt: 'ASC',
                }
            })
            return artworks

        } catch (error) {
            console.log(error.message)
            throw new HttpException(error.message, error.status)
        }
    }

    //GET ARTWORK BY id
    async getArtworkById(id: string){
        try {
            const artwork = await this.artworkRepository.findOne({
                where: {
                    id: id,
                }
            })
    
            if (artwork) {
                return artwork
            }
    
            throw new HttpException('Artwork not found', HttpStatus.NOT_FOUND)
        } catch (error) {
            console.log(error.message);
            throw new HttpException(error.message, error.status)
        }
    }


    //GET ALL REQUEST VALIDATION ARTWORK
    async getAllRequestValidationArtwork() {
        try{
            const artworks = await this.artworkRepository.find({
                where: [
                    { validationStatus: ValidationStatus.UNVALID},
                    { validationStatus: ValidationStatus.DENIED }
                ],
                order: {
                    updatedAt: 'ASC',
                }
            });
            return artworks;

        } catch (error) {
            console.log(error.message);
            throw new HttpException(error.message, error.status)
        }
    }

    //GET ALL REQUEST VALIDATION ARTWORK BY USER
    async getAllRequestValidationArtworkByUser(id: string) {
        try{
            const artworks = await this.artworkRepository.find({
                where: [
                    { userId: id, validationStatus: ValidationStatus.UNVALID },
                    { userId: id, validationStatus: ValidationStatus.DENIED }
                ],
                order: {
                    updatedAt: 'ASC',
                }
            })
            return artworks

        } catch (error) {
            console.log(error.message)
            throw new HttpException(error.message, error.status)
        }
    }

    //UPDATE ARTWORK DATA
    async update(id: string, artworkData: UpdateArtworkDto) {
        try {
            const updateArtwork = await this.artworkRepository.update(id, artworkData)

            if (!updateArtwork.affected){
                throw new HttpException('Update Failed', HttpStatus.EXPECTATION_FAILED)
            } else {
                const validationData: ValidationArtworkDto = {
                    validationStatus: ValidationStatus.UNVALID,
                    validationNote: ""
                }
                await this.artworkRepository.update(id, validationData)

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

    //UPDATE ARTWORK IMAGE
    async updateImage(id: string, imageData: UpdateArtworkImageDto) {
        try {
            const updateArtwork = await this.artworkRepository.update(id, imageData)

            if (!updateArtwork.affected){
                throw new HttpException('Update Failed', HttpStatus.EXPECTATION_FAILED)
            } else {
                const validationData: ValidationArtworkDto = {
                    validationStatus: ValidationStatus.UNVALID,
                    validationNote: ""
                }
                await this.artworkRepository.update(id, validationData)

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

    //UPDATE ARTWORK VIDEO
    async updateVideo(id: string, videoData: UpdateArtworkVideoDto) {
        try {
            const updateArtwork = await this.artworkRepository.update(id, videoData)

            if (!updateArtwork.affected){
                throw new HttpException('Update Failed', HttpStatus.EXPECTATION_FAILED)
            } else {
                const validationData: ValidationArtworkDto = {
                    validationStatus: ValidationStatus.UNVALID,
                    validationNote: ""
                }
                await this.artworkRepository.update(id, validationData)

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

    //UPDATE ARTWORK CERTIFICATE
    async updateCertificate(id: string, certificateData: UpdateArtworkCertificateDto) {
        try {
            const updateArtwork = await this.artworkRepository.update(id, certificateData)

            if (!updateArtwork.affected){
                throw new HttpException('Update Failed', HttpStatus.EXPECTATION_FAILED)
            } else {
                const validationData: ValidationArtworkDto = {
                    validationStatus: ValidationStatus.UNVALID,
                    validationNote: ""
                }
                await this.artworkRepository.update(id, validationData)

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

    //UPDATE ARTWORK LOCATION
    async updateLocation(id: string, locationData: UpdateArtworkLocationDto) {
        try {
            const updateArtwork = await this.artworkRepository.update(id, locationData)

            if (!updateArtwork.affected){
                throw new HttpException('Update Failed', HttpStatus.EXPECTATION_FAILED)
            } else {
                const validationData: ValidationArtworkDto = {
                    validationStatus: ValidationStatus.UNVALID,
                    validationNote: ""
                }
                await this.artworkRepository.update(id, validationData)

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
    async updateValidation(id: string, validationData: ValidationArtworkDto) {
        try {
            const updateArtwork = await this.artworkRepository.update(id, validationData)

            if (!updateArtwork.affected){
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

    //SUSPEND ARTWORK
    async suspendArtwork(id: string, suspendData: SuspendArtworkDto) {
        try {
            const updateArtwork = await this.artworkRepository.update(id, suspendData)

            if (!updateArtwork.affected){
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

    //DELETE ARTWORK
    async delete(id: string) {
        try {
            const deleteArtwork = await this.artworkRepository.delete(id);
            if (!deleteArtwork.affected) {
                throw new HttpException('Artwork not found', HttpStatus.NOT_FOUND)
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