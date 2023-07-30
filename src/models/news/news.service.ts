import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import News from "./news.entity";
import { CreateNewsDto } from "./dto/news.create.dto";
import { HttpException, HttpStatus } from "@nestjs/common";
import { UpdateNewsDto, UpdateNewsImageDto } from "./dto/news.update.dto";

export class NewsService{
    constructor(
        @InjectRepository(News) private newsRepository: Repository<News>,
    ){}
    
    //CREATE NEWS
    async create(newsData: CreateNewsDto) {
        try {
            await this.newsRepository.save(newsData)
            const response = {
                message: 'Success'
            }

            return response

        } catch (error) {
            console.log(error.message)
            throw new HttpException(error.message, error.status)
        }
    }

    //GET ALL NEWS
    async getAllNews() {
        try{
            const news = await this.newsRepository.find({
                order: {
                    updatedAt: 'ASC',
                }
            })
            return news

        } catch (error) {
            console.log(error.message)
            throw new HttpException(error.message, error.status)
        }
    }

    //GET NEWS BY id
    async getNewsById(id: string){
        try {
            const news = await this.newsRepository.findOne({
                where: {
                    id: id,
                }
            })
    
            if (news) {
                return news
            }
    
            throw new HttpException('News not found', HttpStatus.NOT_FOUND)
        } catch (error) {
            console.log(error.message)
            throw new HttpException(error.message, error.status)
        }
    }

    //UPDATE NEWS
    async update(id: string, newsData: UpdateNewsDto) {
        try {
            const updateNews = await this.newsRepository.update(id, newsData)

            if (!updateNews.affected) {
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

    //UPDATE IMAGE
    async updateImage(id: string, imageData: UpdateNewsImageDto) {
        try {
            const updateNews = await this.newsRepository.update(id, imageData)

            if (!updateNews.affected) {
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

    //DELETE NEWS
    async delete(id: string) {
        try {
            const deleteNews = await this.newsRepository.delete(id);
            if (!deleteNews.affected) {
                throw new HttpException('News not found', HttpStatus.NOT_FOUND)
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