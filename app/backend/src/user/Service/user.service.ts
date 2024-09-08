import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { UserDTO, CreateUserDTO, UpdateUserDTO } from '../DTO';
import { UserEntity } from '../Entity';
import {
    BaseService,
    NotFoundLabel,
    EntityEnum,
    DuplicatedProp,
    FixLazyLoadingProps,
    InsuficientPernmissions,
    InvalidRole
} from '../../utils';
import {
    IndicatorEntity,
    IndicatorTypesEnum,
    RolesEnum, 
    RoleDTO
} from '../../indicator';


@Injectable()
export class UserService extends BaseService<UserEntity, UserDTO, CreateUserDTO, UpdateUserDTO> {

    protected override readonly entityName: string = EntityEnum.USER;

    constructor(
        @InjectRepository(UserEntity)
        protected readonly repository: Repository<UserEntity>,

        @InjectRepository(IndicatorEntity)
        private readonly indicatorRepository: Repository<IndicatorEntity>
    ) { 
        super(repository)
    }

    public async getAvaliableRoles(): Promise<RoleDTO[]>{
        try{
            const avaliableRoles = await this.indicatorRepository.find({
                where: {
                    id: Not(RolesEnum.ADMIN_ROLE),
                    indicatorType: {
                        id: IndicatorTypesEnum.ROLE
                    }
                }
            })

            return avaliableRoles
        }catch(err){
            throw err
        }
    }

    public override async create(userToCreate: CreateUserDTO): Promise<UserDTO>{
        try{
            const hasAdminRole = userToCreate.roles.some(role => role.id === RolesEnum.ADMIN_ROLE);

            if(hasAdminRole){
                throw new HttpException(InsuficientPernmissions(), HttpStatus.FORBIDDEN)
            }

            const isEmailDuplicated = !!(await this.repository.count({
                where: {
                    email: userToCreate.email
                }
            }))

            if(isEmailDuplicated){
                throw new HttpException(DuplicatedProp('email'), HttpStatus.BAD_REQUEST)
            }

            for(const role of userToCreate.roles){
                const foundedRole = await this.indicatorRepository.findOne({
                    where: {
                        id: role.id,
                        active: true
                    }
                })

                if(!foundedRole){
                    throw new HttpException(InvalidRole(), HttpStatus.UNPROCESSABLE_ENTITY)
                }
            }

            const roles = Promise.resolve(userToCreate.roles);
            const newUser = this.repository.create({ ...userToCreate, roles});
            newUser.roles = roles;
            await this.repository.save(newUser);
            FixLazyLoadingProps(newUser);
            delete newUser.password;
            return newUser

        }catch(err){
            throw err
        }
    }

    public async findUserByEmailWithPassword(email: string): Promise<UserDTO>{
        try{
            const foundedUser = await this.repository.findOne({
              select: [
                'id',
                'name',
                'email',
                'password',
                'active'
              ],
              where: {
                email
              }
            })

            if(!foundedUser) {
                throw new HttpException(NotFoundLabel(this.entityName, this.isEntityMaleGender), HttpStatus.NOT_FOUND)
            }

            return foundedUser
        }catch(err){
            throw err
        }
    }

    public async getByIdNonProtected(id: number): Promise<UserDTO> {

        try {

            const foundedUser = await this.repository.findOne({
                where: {
                    id
                }
            });

            if(!foundedUser) {
                throw new HttpException(NotFoundLabel(this.entityName, this.isEntityMaleGender), HttpStatus.NOT_FOUND)
            }

            return foundedUser

        }catch(err) {
            throw err
        }
    }
}
