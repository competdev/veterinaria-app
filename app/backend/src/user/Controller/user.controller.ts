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
import { UserDTO, CreateUserDTO, UpdateUserDTO } from '../DTO';
import { UserEntity } from '../Entity';
import { UserService } from '../Service'; 
import { RoleDTO, RolesEnum } from '../../indicator';
import { Roles } from '../../auth/Decorator/roles.decorator';
import { JWTAuthGuard } from '../../auth/Guards/jwt.guard';
import { RoleGuard } from '../../auth/Guards/roles.guard';

@ApiTags('User')
@Controller('user')
export class UserController extends BaseController<UserEntity, UserDTO, CreateUserDTO, UpdateUserDTO> {

    constructor (
        protected readonly service: UserService
    ) {
        super(service)
    }
    
    @Post()
    public override async create(@Body() entityToCreate: CreateUserDTO): Promise<UserDTO>{
        try{
            const response = await this.service.create(entityToCreate);
            return response
        }catch(err){
            throw err
        }
    }

    @Get('/role')
    public async getAvaliableRoles(): Promise<RoleDTO[]>{
        try{
            const response = await this.service.getAvaliableRoles();
            return response
        }catch(err){
            throw err
        }
    }

    @ApiBearerAuth()
    @UseGuards(JWTAuthGuard, RoleGuard)
    @Roles(RolesEnum.ADMIN_ROLE, RolesEnum.PROFESSOR_ROLE, RolesEnum.STUDENT_ROLE)
    @Put(':id')
    public override async updateById(
        @Param() requestParam: RequestParamsDTO,
        @Body() userToUpdate: UpdateUserDTO,
        @Request() req
    ): Promise<UpdateResponse> {
        try {
            if(!Object.keys(userToUpdate).length){
                throw new HttpException(NothingToUpdate(), HttpStatus.BAD_REQUEST)
            }

            const response = await this.service.updateById(requestParam.id, userToUpdate, req);
            return response
        } catch (err) {
            throw err
        }
    }
}
