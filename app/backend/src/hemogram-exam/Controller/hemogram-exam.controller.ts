import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
    Request,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BaseController, NothingToUpdate, RequestParamsDTO, UpdateResponse } from '../../utils';
import { HemogramExamDTO, CreateHemogramExamDTO, UpdateHemogramExamDTO } from '../DTO';
import { HemogramExamEntity } from '../Entity';
import { HemogramExamService } from '../Service'; 
import { RolesEnum } from '../../indicator';
import { Roles } from '../../auth/Decorator/roles.decorator';
import { JWTAuthGuard } from '../../auth/Guards/jwt.guard';
import { RoleGuard } from '../../auth/Guards/roles.guard';

@ApiTags('Hemogram Exam')
@Controller('hemogram-exam')
export class HemogramExamController extends BaseController<HemogramExamEntity, HemogramExamDTO, CreateHemogramExamDTO, UpdateHemogramExamDTO>{

    constructor (
        protected readonly service: HemogramExamService
    ) {
        super(service)
    }

    @ApiBearerAuth()
    @UseGuards(JWTAuthGuard, RoleGuard)
    @Roles(RolesEnum.ADMIN_ROLE, RolesEnum.PROFESSOR_ROLE, RolesEnum.STUDENT_ROLE)
    @Post()
    public override async create(
        @Body() entityToCreate: CreateHemogramExamDTO,
        @Request() req
    ): Promise<HemogramExamDTO>{
        try{
            const response = await this.service.create(entityToCreate, req);
            return response
        }catch(err){
            throw err
        }
    }

    @ApiBearerAuth()
    @UseGuards(JWTAuthGuard, RoleGuard)
    @Roles(RolesEnum.ADMIN_ROLE, RolesEnum.PROFESSOR_ROLE, RolesEnum.STUDENT_ROLE)
    @Get('/user')
    public async getAllForUser(@Request() req): Promise<HemogramExamDTO[]> {
        try {
            const response = await this.service.getAllForUser(req.user);
            return response
        } catch (err) {
            throw err
        }
    }

    @ApiBearerAuth()
    @UseGuards(JWTAuthGuard, RoleGuard)
    @Roles(RolesEnum.ADMIN_ROLE, RolesEnum.PROFESSOR_ROLE, RolesEnum.STUDENT_ROLE)
    @Put(':id')
    public override async updateById(
        @Param() requestParam: RequestParamsDTO,
        @Body() hemogramExamToUpdate: UpdateHemogramExamDTO,
        @Request() req
    ): Promise<UpdateResponse> {
        try {
            if(!Object.keys(hemogramExamToUpdate).length){
                throw new HttpException(NothingToUpdate(), HttpStatus.BAD_REQUEST)
            }

            const response = await this.service.updateById(requestParam.id, hemogramExamToUpdate, req);
            return response
        } catch (err) {
            throw err
        }
    }
}
