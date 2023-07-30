import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import FavoriteArtwork from "./favoriteArtwork.entity";
import { CreateFavoriteArtworkDto } from "./dto/favoriteArtwork.create.dto";
import { HttpException, HttpStatus } from "@nestjs/common";

export class FavoriteArtworkService{
    constructor(
        @InjectRepository(FavoriteArtwork) private favoriteArtworkRepository: Repository<FavoriteArtwork>,
    ){}

    //CREATE FAVORITE ARTWORK
    async create( favoriteArtworkData: CreateFavoriteArtworkDto) {
        try {
            await this.favoriteArtworkRepository.save(favoriteArtworkData)

            const response = {
                message: 'Success'
            }

            return response

        } catch (error) {
            console.log(error.message);
            throw new HttpException(error.message, error.status)
        }
    }

    //GET ALL FAVORITE ARTWORK BY USER
    async getAllFavoriteArtwork(id: string) {
        try{
            const favoriteArtworks = await this.favoriteArtworkRepository.find({
                relations: [
                    'artwork'
                ],
                where: {
                    userId: id
                },
                order: {
                    updatedAt: 'ASC',
                }
            });
            return favoriteArtworks

        } catch (error) {
            console.log(error.message);
            throw new HttpException(error.message, error.status)
        }
    }

    //DELETE FAVORITE ARTWORK
    async delete(id: string) {
        try {
            const deleteFavoriteArtwork = await this.favoriteArtworkRepository.delete(id)
            if (!deleteFavoriteArtwork.affected) {
                throw new HttpException('Favorite Artwork not found', HttpStatus.NOT_FOUND)
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