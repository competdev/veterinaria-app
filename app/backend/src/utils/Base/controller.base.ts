import { ApiBearerAuth } from '@nestjs/swagger';
import {
    Get,
    Put,
    Param,
    Request,
    UseGuards,
} from '@nestjs/common';
import { BaseService } from './service.base';
import { RequestParamsDTO, UpdateResponse } from '../DTO'
import { RolesEnum } from '../../indicator';
import { Roles } from '../../auth/Decorator/roles.decorator';
import { JWTAuthGuard } from '../../auth/Guards/jwt.guard';
import { RoleGuard } from '../../auth/Guards/roles.guard';

export abstract class BaseController<EntityRef, DTORef, CreateDTORef, UpdateDTORef> {

    constructor(
        protected readonly service: BaseService<EntityRef, DTORef, CreateDTORef, UpdateDTORef>,

    ) { }

    public abstract create(entityToCreate: CreateDTORef, req?: any): Promise<DTORef>
    public abstract updateById(requestParam: RequestParamsDTO, entityToUpdate: UpdateDTORef, req): Promise<UpdateResponse>

    @ApiBearerAuth()
    @UseGuards(JWTAuthGuard, RoleGuard)
    @Roles(RolesEnum.ADMIN_ROLE)
    @Get()
    public async getAll(): Promise<DTORef[]> {
        try {
            const response = await this.service.getAll();
            return response
        } catch (err) {
            throw err
        }
    }

    @ApiBearerAuth()
    @UseGuards(JWTAuthGuard, RoleGuard)
    @Roles(RolesEnum.ADMIN_ROLE, RolesEnum.PROFESSOR_ROLE, RolesEnum.STUDENT_ROLE)
    @Get(':id')
    public async getById(@Param() requestParam: RequestParamsDTO, @Request() req): Promise<DTORef> {

        try {
            const response = await this.service.getById(requestParam.id, req);
            return response
        } catch (err) {
            throw err
        }
    }


    @ApiBearerAuth()
    @UseGuards(JWTAuthGuard, RoleGuard)
    @Roles(RolesEnum.ADMIN_ROLE, RolesEnum.PROFESSOR_ROLE, RolesEnum.STUDENT_ROLE)
    @Put('deactivate/:id')
    public async deactiveteById(@Param() requestParam: RequestParamsDTO, @Request() req): Promise<UpdateResponse> { 
        try {
            const response = await this.service.deactivateById(requestParam.id, req);
            return response
        } catch (err) {
            throw err
        }
    }

    @ApiBearerAuth()
    @UseGuards(JWTAuthGuard, RoleGuard)
    @Roles(RolesEnum.ADMIN_ROLE, RolesEnum.PROFESSOR_ROLE, RolesEnum.STUDENT_ROLE)
    @Put('activate/:id')
    public async activateById(@Param() requestParam: RequestParamsDTO, @Request() req): Promise<UpdateResponse> {
        try {
            const response = await this.service.activateById(requestParam.id, req);
            return response
        } catch (err) {
            throw err
        }
    }
}