import { HttpException, HttpStatus } from "@nestjs/common";
import { DeepPartial, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { UpdateResponse } from "../DTO";
import { ActionsEnum, ResponseStatuEnum } from "../Enums";
import {
    CheckAccessPermissionOnObject,
    EntityActionPerformed,
    EntityAlreadyActivated,
    EntityAlreadyDeactivated,
    EntityNotActive,
    InsuficientPernmissions,
    NotFoundLabel
} from "../Services";

export abstract class BaseService<EntityRef, DTORef, CreateDTORef, UpdateDTORef> {

    protected abstract readonly entityName: string;
    protected isEntityMaleGender: boolean = true;

    constructor(
        protected readonly repository: Repository<EntityRef>
    ) { }

    public async create(entityToCreate: CreateDTORef, req?: any): Promise<DTORef>{
        try {
            const newEntity = await this.repository.save(entityToCreate as DeepPartial<EntityRef>[]);
            return newEntity as any
        }catch(err){
            throw err
        }
    } 

    public async getAll(): Promise<DTORef[]> {

        try {

            const entityList = await this.repository.find();
            return entityList as any

        }catch(err) {
            throw err
        }
    } 

    public async getById(id: number, req: any): Promise<DTORef> {

        try {

            const entity = await this.repository.findOne({
                where: {
                    id
                }
            });

            if(!entity) {
                throw new HttpException(NotFoundLabel(this.entityName, this.isEntityMaleGender), HttpStatus.NOT_FOUND)
            }

            if(!CheckAccessPermissionOnObject(entity['id'], req)){
                throw new HttpException(InsuficientPernmissions(), HttpStatus.FORBIDDEN)
            }

            return entity as any

        }catch(err) {
            throw err
        }
    } 

    public async updateById(id: number, entityToUpdate: UpdateDTORef, req: any): Promise<UpdateResponse> {
        try{
            const foundedEntity = await this.getById(id, req);

            if(!foundedEntity['active']){
                throw new HttpException(EntityNotActive(this.entityName, this.isEntityMaleGender), HttpStatus.BAD_REQUEST)
            }

            await this.repository.update(id, ({ ...entityToUpdate }) as QueryDeepPartialEntity<EntityRef>);
            
            const updateResponse : UpdateResponse = {
                action: ActionsEnum.UPDATE,
                status: ResponseStatuEnum.SUCCESS,
                message: EntityActionPerformed(this.entityName, ActionsEnum.UPDATE, this.isEntityMaleGender)
            }

            return updateResponse
        }catch(err: any){
            const updateResponse : UpdateResponse = {
                action: ActionsEnum.UPDATE,
                status: ResponseStatuEnum.ERROR,
                message: err.message
            }

            if(err instanceof HttpException){
                throw new HttpException(updateResponse, err.getStatus())
            }

            throw new HttpException(updateResponse, HttpStatus.BAD_REQUEST)

        }
    } 

    public async deactivateById(id: number, req: any): Promise<UpdateResponse>  {
        try{
            const foundedEntity = await this.getById(id, req);
            if(!foundedEntity['active']){
                throw new HttpException(EntityAlreadyDeactivated(this.entityName, this.isEntityMaleGender), HttpStatus.BAD_REQUEST)
            }

            await this.repository.update(id, ({ ...foundedEntity, active: false}) as QueryDeepPartialEntity<EntityRef>);
            
            const deactivateResponse : UpdateResponse = {
                action: ActionsEnum.DEACTIVATE,
                status: ResponseStatuEnum.SUCCESS,
                message: EntityActionPerformed(this.entityName, ActionsEnum.DEACTIVATE, this.isEntityMaleGender)
            }

            return deactivateResponse
        }catch(err: any){
            const deactivateResponse : UpdateResponse = {
                action: ActionsEnum.DEACTIVATE,
                status: ResponseStatuEnum.ERROR,
                message: err.message
            }

            if(err instanceof HttpException){
                throw new HttpException(deactivateResponse, err.getStatus())
            }

            throw new HttpException(deactivateResponse, HttpStatus.BAD_REQUEST)

        }
    } 

    public async activateById(id: number, req: any): Promise<UpdateResponse> {
        try{
            const foundedEntity = await this.getById(id, req);
            if(foundedEntity['active']){
                throw new HttpException(EntityAlreadyActivated(this.entityName, this.isEntityMaleGender), HttpStatus.BAD_REQUEST)
            }

            await this.repository.update(id, ({ ...foundedEntity, active: true}) as QueryDeepPartialEntity<EntityRef>);
            
            const activateResponse : UpdateResponse = {
                action: ActionsEnum.ACTIVATE,
                status: ResponseStatuEnum.SUCCESS,
                message: EntityActionPerformed(this.entityName, ActionsEnum.ACTIVATE, this.isEntityMaleGender)
            }

            return activateResponse
        }catch(err: any){
            const activateResponse : UpdateResponse = {
                action: ActionsEnum.ACTIVATE,
                status: ResponseStatuEnum.ERROR,
                message: err.message
            }

            if(err instanceof HttpException){
                throw new HttpException(activateResponse, err.getStatus())
            }

            throw new HttpException(activateResponse, HttpStatus.BAD_REQUEST)

        }
    }     
}