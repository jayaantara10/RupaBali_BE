import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Admin from "./admin.entity";
import { Repository } from "typeorm";
import { CreateAdminDto } from "./dto/admin.create.dto";
import * as bcrypt from 'bcrypt';
import { UpdatePasswordAdminDto, UpdateProfileAdminDto, UpdateProfilePictureAdminDto } from "./dto/admin.update.dto";
import { VerificationAdminDto } from "./dto/admin.verification.dto";

@Injectable()
export class AdminService{
    constructor(
        @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    ){}

    //REGISTER ADMIN
    async register(adminData: CreateAdminDto) {
        try {
            const isAdminExist = await this.isAdminExist(adminData.email)

            if(!isAdminExist){

                const newAdmin = this.adminRepository.create({
                    ...adminData, password: await bcrypt.hash(adminData.password, 16)
                })
                await this.adminRepository.save(newAdmin);

                const response = {
                    message: 'Success'
                }

                return response
            }

            throw new HttpException('Email already used', HttpStatus.FORBIDDEN);

        } catch (error) {
            console.log(error.message)
            throw new HttpException(error.message, error.status)
        }
    }

    //GET ALL ADMIN
    async getAllAdmin() {
        try{
            const admins = await this.adminRepository.find({
                order: {
                    id: 'ASC',
                }
            });

            admins.map(admin => {
                delete admin.password
            })

            return admins;

        } catch (error) {
            console.log(error.message);
            throw new HttpException(error.message, error.status)
        }
    }

    //GET ALL REQUEST VERIFICATION ADMIN
    async getAllRequestVerificationAdmin() {
        try{
            const admins = await this.adminRepository.find({
                order: {
                    id: 'DESC',
                },
                where: {
                    isVerify: false,
                }
            });

            admins.map(admin => {
                delete admin.password
            })

            return admins;

        } catch (error) {
            console.log(error.message);
            throw new HttpException(error.message, error.status)
        }
    }

    //GET ADMIN BY id
    async getAdminById(id: string){
        try {
            const admin = await this.adminRepository.findOne({
                where: {
                    id: id,
                }
            })
    
            if (admin) {
                delete admin.password
                return admin
            }
    
            throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
        } catch (error) {
            console.log(error.message);
            throw new HttpException(error.message, error.status)
        }
    }

    //CHECK ADMIN IS exists
    async isAdminExist(email: string) {
        try {
            const isExist = await this.adminRepository.findOne({
                where: {
                    email: email,
                }
            })

            if (isExist) {
                return true
            }

            return false

        }catch (error) {
            console.log(error.message);
            throw new HttpException(error.message, error.status);
        }
    }
    
    //UPDATE ADMIN
    async updateProfile(id: string, profileData: UpdateProfileAdminDto) {
        try {
            const updateAdmin = await this.adminRepository.update(id, profileData);
            if (!updateAdmin.affected){
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

    //UPDATE PROFILE PICTURE ADMIN
    async updateProfilePicture(id: string, profilePictureData: UpdateProfilePictureAdminDto) {
        try {
            const updateAdmin = await this.adminRepository.update(id, profilePictureData);
            if (!updateAdmin.affected){
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

    //CHANGE PASSWORD ADMIN
    async updatePassword(id: string, passwordData: UpdatePasswordAdminDto) {
        try {
            const admin = await this.adminRepository.findOne({
                where: {
                    id: id,
                }
            })
    
            const newPassword = {
                password: await bcrypt.hash(passwordData.newPassword, 10)
            }
    
            if(passwordData.oldPassword){
                const isPasswordMatch = await bcrypt.compare(passwordData.oldPassword, admin.password)
                if (isPasswordMatch) {
                    const updateAdmin = await this.adminRepository.update(id, newPassword);
                    if (!updateAdmin.affected){
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
                const updateAdmin = await this.adminRepository.update(id, newPassword);
                if (!updateAdmin.affected){
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

    //VERIFICATION ADMIN
    async verification(id: string, verifyData: VerificationAdminDto) {
        try {
            const updateAdmin = await this.adminRepository.update(id, verifyData);
            if (!updateAdmin.affected){
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


    //DELETE ADMIN
    async delete(id: string) {
        try {
            const deleteAdmin = await this.adminRepository.delete(id);
            if (!deleteAdmin.affected) {
                throw new HttpException('Admin not found', HttpStatus.NOT_FOUND)
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