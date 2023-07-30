import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/user.create.dto";
import User from "./user.entity";
import * as bcrypt from 'bcrypt';
import { VerifyStatus } from "src/common/enum/verifyStatus.enum";
import { SuspendUserDto } from "./dto/user.suspend.dto";
import { RequestVerificationUserDto, UpdateIdentityCardUserDto, VerificationUserDto } from "./dto/user.verification.dto";
import { UpdateBackgroundPictureUserDto, UpdatePasswordUserDto, UpdateProfilePictureUserDto, UpdateProfileUserDto } from "./dto/user.update.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        
    ) {}

    //REGISTER USER
    async register(userData: CreateUserDto) {
        try {
            const isUserExist = await this.isUserExist(userData.username, userData.email)

            if(!isUserExist) {

                const newUser = this.userRepository.create({
                    ...userData, password: await bcrypt.hash(userData.password, 16)
                });

                await this.userRepository.save(newUser);

                const response = {
                    message: 'Success'
                }
    
                return response
            }

            throw new HttpException('Email already used', HttpStatus.FORBIDDEN)

        } catch (error) {
            console.log(error.message);
            throw new HttpException(error.message, error.status)
        }
    }

    //GET ALL USER
    async getAllUser() {
        try{
            const users = await this.userRepository.find({
                order: {
                    id: 'ASC',
                }
            });

            users.map(user =>{
                delete user.password
            })

            return users

        } catch (error) {
            console.log(error.message);
            throw new HttpException(error.message, error.status)
        }
    }

    //GET ALL REQUEST VERIFICATION USER
    async getAllRequestVerificationUser() {
        try{
            const users = await this.userRepository.find({
                order: {
                    id: 'DESC',
                },
                where: {
                    verifyStatus: VerifyStatus.SUBMIT,
                }
            });

            users.map(user =>{
                delete user.password
            })

            return users

        } catch (error) {
            console.log(error.message);
            throw new HttpException(error.message, error.status)
        }
    }

    //GET USER BY id
    async getUserById(id: string){
        try {
            const user = await this.userRepository.findOne({
                where: {
                    id: id,
                }
            });
    
            if (user) {
                delete user.password
                return user
            }
    
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        } catch (error) {
            console.log(error.message);
            throw new HttpException(error.message, error.status)
        }
    }
    

    //CHECK USER IS EXIST
    async isUserExist(username: string, email: string) {
        try {
            const isExist = await this.userRepository.findOne({
                where: [
                    { username: username},
                    { email: email }
                ]
            })

            if (isExist) {
                return true
            }

            return false

        }catch (error) {
            console.log(error.message);
            throw new HttpException(error.message, error.status)
        }
    }
    
    //UPDATE PROFILE USER
    async updateProfile(id: string, profileData: UpdateProfileUserDto) {
        try{
            const updateUser = await this.userRepository.update(id, profileData);
            if (!updateUser.affected){
                throw new HttpException('Update Failed', HttpStatus.EXPECTATION_FAILED);
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

    //UPDATE PASSWORD USER
    async updatePassword(id: string, passwordData: UpdatePasswordUserDto) {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    id: id,
                }
            })
    
            const newPassword = {
                password: await bcrypt.hash(passwordData.newPassword, 10)
            }
    
            if(passwordData.oldPassword){
                const isPasswordMatch = await bcrypt.compare(passwordData.oldPassword, user.password)
                if (isPasswordMatch) {
                    const updateUser = await this.userRepository.update(id, newPassword);
                    if (!updateUser.affected){
                        throw new HttpException('Update Failed', HttpStatus.EXPECTATION_FAILED);
                    } else {
                        const response = {
                            message: 'Success'
                        }
            
                        return response
                    }

                }
                throw new HttpException('Old Passwrod wrong', HttpStatus.FORBIDDEN);
            } else {
                const updateUser = await this.userRepository.update(id, newPassword);
                if (!updateUser.affected){
                    throw new HttpException('Update Failed', HttpStatus.EXPECTATION_FAILED);
                } else {
                    const response = {
                        message: 'Success'
                    }
        
                    return response
                }
                
            }
        } catch (error) {
            console.log(error.message);
            throw new HttpException(error.message, error.status)
        }
    }

    //UPDATE PROFILE PICTURE USER
    async updateProfilePicture(id: string, profilePictureData: UpdateProfilePictureUserDto) {
        try {
            const updateUser = await this.userRepository.update(id, profilePictureData);

            if (!updateUser.affected){
                throw new HttpException('Update Failed', HttpStatus.EXPECTATION_FAILED);
            } else {
                const response = {
                    message: 'Success'
                }
    
                return response
            }

        } catch (error) {
            console.log(error.message);
            throw new HttpException(error.message, error.status);
        }
    }

    //UPDATE IDENITY CARD USER
    async updateIdentityCard(id: string, identityCardData: UpdateIdentityCardUserDto) {
        try {
            const updateUser = await this.userRepository.update(id, identityCardData);

            if (!updateUser.affected){
                throw new HttpException('Update Failed', HttpStatus.EXPECTATION_FAILED);
            } else {
                const response = {
                    message: 'Success'
                }
    
                return response
            }

        } catch (error) {
            console.log(error.message);
            throw new HttpException(error.message, error.status);
        }
    }

    //CHANGE BACKGROUND PICTURE USER
    async updateBackgroundPicture(id: string, backgroundPictureData: UpdateBackgroundPictureUserDto) {
        try {
            const updateUser = await this.userRepository.update(id, backgroundPictureData);

            if (!updateUser.affected){
                throw new HttpException('Update Failed', HttpStatus.EXPECTATION_FAILED);
            } else {
                const response = {
                    message: 'Success'
                }
    
                return response
            }

        } catch (error) {
            console.log(error.message);
            throw new HttpException(error.message, error.status);
        }
    }

    //REQUEST VERIFICATION
    async requestVerification(id: string, requestData: RequestVerificationUserDto) {
        try {
            const updateUser = await this.userRepository.update(id, requestData)
    
            if (!updateUser.affected){
                throw new HttpException('Request Failed', HttpStatus.EXPECTATION_FAILED);
            } else {
                const verifyData: VerificationUserDto = {
                    verifyStatus: VerifyStatus.SUBMIT,
                    verifivcationNote: ""
                }
                await this.userRepository.update(id, verifyData)

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

    //VERIFICATION USER
    async verification(id: string, verifyData: VerificationUserDto) {
        try {
            const updateUser = await this.userRepository.update(id, verifyData);

            if (!updateUser.affected){
                throw new HttpException('Update Failed', HttpStatus.EXPECTATION_FAILED);
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

    //SUSPEND USER
    async suspend(id: string, suspendData: SuspendUserDto) {
        try {
            const updateUser = await this.userRepository.update(id, suspendData);
            if (!updateUser.affected){
                throw new HttpException('Update Failed', HttpStatus.EXPECTATION_FAILED);
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

    //DELETE USER
    async delete(id: string) {
        try {
            const deleteUser = await this.userRepository.delete(id);
            if (!deleteUser.affected) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
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