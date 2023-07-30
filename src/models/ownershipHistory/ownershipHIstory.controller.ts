import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from "@nestjs/common";
import { OwnershipHistoryService } from "./ownershipHistory.service";
import { UserRole } from "src/common/enum/userRole.enum";
import { AdminRoles, UserRoles } from "src/authentication/auth.decorator";
import { JwtGuard } from "src/authentication/guards/jwt.guard";
import { AdminRolesGuard, UserRolesGuard } from "src/authentication/guards/roles.guard";
import { CreateOwnershipHistoryDto } from "./dto/ownershipHistory.create.dto";
import { UpdateOwnershipHistoryDto } from "./dto/ownershipHistory.update.dto";
import { AdminRole } from "src/common/enum/adminRole.enum";

@Controller('ownership-history')
export class OwnershipHistoryController{
    constructor(
        private readonly ownershipHistoryService: OwnershipHistoryService,
    ){}

    //CREATE OWNERSHIP HISTORY
    @UserRoles(UserRole.ARTIST, UserRole.COLLECTOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Post()
    async create(@Body() ownershipHistoryData: CreateOwnershipHistoryDto) {
        return this.ownershipHistoryService.create(ownershipHistoryData)
    }
    
    //GET LIST OWNERSHIP HISTORY IN ADMIN
    @AdminRoles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN, AdminRole.VALIDATOR)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Get('in-admin/by-artwork/:id')
    getListOwnershipHistoryInAdmin(@Param('id') id) {
        return this.ownershipHistoryService.getAllOwnershipHistory(id)
    }

    //GET LIST OWNERSHIP HISTORY IN USER
    @UserRoles(UserRole.ARTIST, UserRole.COLLECTOR, UserRole.VISITOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Get('in-user/by-artwork/:id')
    getListOwnershipHistoryInUser(@Param('id') id) {
        return this.ownershipHistoryService.getAllOwnershipHistory(id)
    }

    //GET OWNERSHIP HISTORY by ID IN ADMIN
    @AdminRoles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN, AdminRole.VALIDATOR)
    @UseGuards(JwtGuard, AdminRolesGuard)
    @Get('in-admin/:id')
    getOwnershipHistoryDetailInAdmin(@Param('id') id) {
        return this.ownershipHistoryService.getOwnershipHistoryById(id);
    }

    //GET OWNERSHIP HISTORY by ID IN USER
    @UserRoles(UserRole.ARTIST, UserRole.COLLECTOR, UserRole.VISITOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Get('in-user/:id')
    getOwnershipHistoryDetail(@Param('id') id) {
        return this.ownershipHistoryService.getOwnershipHistoryById(id);
    }

    //UPDATE OWNERSHIP HISTORY
    @UserRoles(UserRole.ARTIST, UserRole.COLLECTOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Put('update/:id')
    async update(@Param('id') id, @Body() ownershipHistoryData: UpdateOwnershipHistoryDto) {
        return this.ownershipHistoryService.update(id, ownershipHistoryData);
    }

    //DELETE OWNERSHIP HISTORY
    @UserRoles(UserRole.ARTIST, UserRole.COLLECTOR)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Delete('delete/:id')
    async delete(@Param('id') id) {
        return this.ownershipHistoryService.delete(id);
    }
}