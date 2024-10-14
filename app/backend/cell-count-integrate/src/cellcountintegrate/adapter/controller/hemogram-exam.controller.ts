import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Inject,
    Param,
    Post,
    Put,
    Request,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BaseController, NothingToUpdate, RequestParamsDTO, UpdateResponse } from '../../../utils';
import { HemogramExamDTO, CreateHemogramExamDTO, UpdateHemogramExamDTO } from '../dto';
import { HemogramExamEntity } from '../../domain/entity';
import { HemogramExamService } from '../../domain/service';
import { JwtGuard, RoleGuard } from '../../../auth/guard';
import { RolesEnum } from '../../../enums';
import { Roles } from '../../../decorator';
import { DI_HEMOGRAMEXAMSERVICE } from '../../../configs';

@ApiTags('Hemogram Exam')
@Controller('hemogram-exam')
export class HemogramExamController extends BaseController<HemogramExamEntity, HemogramExamDTO, CreateHemogramExamDTO, UpdateHemogramExamDTO> {

    constructor(
        @Inject(DI_HEMOGRAMEXAMSERVICE) protected readonly service: HemogramExamService
    ) {
        super(service)
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard, RoleGuard)
    @Roles(RolesEnum.ADMIN_ROLE, RolesEnum.PROFESSOR_ROLE, RolesEnum.STUDENT_ROLE)
    @Post()
    public override async create(
        @Body() entityToCreate: CreateHemogramExamDTO,
        @Request() req
    ): Promise<HemogramExamDTO> {
        try {
            const response = await this.service.create(entityToCreate, req);
            return response
        } catch (err) {
            throw err
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard, RoleGuard)
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
    @UseGuards(JwtGuard, RoleGuard)
    @Roles(RolesEnum.ADMIN_ROLE, RolesEnum.PROFESSOR_ROLE, RolesEnum.STUDENT_ROLE)
    @Put(':id')
    public override async updateById(
        @Param() requestParam: RequestParamsDTO,
        @Body() hemogramExamToUpdate: UpdateHemogramExamDTO,
        @Request() req
    ): Promise<UpdateResponse> {
        try {
            if (!Object.keys(hemogramExamToUpdate).length) {
                throw new HttpException(NothingToUpdate(), HttpStatus.BAD_REQUEST)
            }

            const response = await this.service.updateById(requestParam.id, hemogramExamToUpdate, req);
            return response
        } catch (err) {
            throw err
        }
    }
}
