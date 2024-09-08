import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    HemogramExamDTO,
    CreateHemogramExamDTO,
    UpdateHemogramExamDTO,
    HemogramExamDocumentDTO,
    UpdateHemogramExamWithResultDTO
} from '../DTO';
import { HemogramExamEntity, HemogramExamDocumentEntity } from '../Entity';
import {
    IndicatorEntity,
    IndicatorTypeNamesEnum,
    IndicatorTypesEnum,
    StatusEnum
} from '../../indicator';
import { DocumentDTO, DocumentService } from '../../document';
import { JobService, CreateJobDTO } from '../../job';
import { UserDTO } from '../../user';
import {
    BaseService,
    EntityEnum,
    UpdateResponse,
    NotImplemented,
    NotFoundLabel,
    CheckAccessPermissionOnObject,
    InsuficientPernmissions,
    FixLazyLoadingProps,
    ActionsEnum,
    ResponseStatuEnum,
    EntityActionPerformed,
    IndicatorNotFoundLabel,
} from '../../utils';

@Injectable()
export class HemogramExamService extends BaseService<HemogramExamEntity, HemogramExamDTO, CreateHemogramExamDTO, UpdateHemogramExamDTO>{
    
    protected override readonly entityName: string = EntityEnum.HEMOGRAM_EXAM;

    constructor(
        @InjectRepository(HemogramExamEntity)
        protected readonly repository: Repository<HemogramExamEntity>,

        @InjectRepository(HemogramExamDocumentEntity)
        protected readonly hemogramExamDocumentRepository: Repository<HemogramExamDocumentEntity>,

        @InjectRepository(IndicatorEntity)
        private readonly indicatorRepository: Repository<IndicatorEntity>,

        private readonly documentService: DocumentService,
        private readonly jobService: JobService,
    ) { 
        super(repository)
    }

    public override async create(hemogramExamToCreate: CreateHemogramExamDTO, req: any): Promise<HemogramExamDTO>{
        try {
            for(const document of hemogramExamToCreate.hemogramExamDocuments){
                await this.documentService.getById(document.id, req)
            }
            const awaitingStatus = await this.indicatorRepository.findOne({
                where:{
                    id: StatusEnum.AWAITING,
                    active: true,
                    indicatorType: {
                        id: IndicatorTypesEnum.STATUS
                    }
                }
            })

            if(!awaitingStatus){
                throw new HttpException(IndicatorNotFoundLabel(IndicatorTypeNamesEnum.STATUS), HttpStatus.NOT_FOUND)
            }

            const newHemogramExam = this.repository.create({ ...hemogramExamToCreate, hemogramExamDocuments: [] });
            newHemogramExam.user = Promise.resolve(req.user);
            newHemogramExam.status = awaitingStatus;
            await this.repository.save(newHemogramExam);
            const hemogramExamDocuments = await this.createHemogramExamDocuments(
                newHemogramExam,
                hemogramExamToCreate.hemogramExamDocuments,
                false
            )

            newHemogramExam.hemogramExamDocuments = hemogramExamDocuments.map(hemogramExamDocumentEntity => {
                delete hemogramExamDocumentEntity.hemogramExam;
                return hemogramExamDocumentEntity
            });

            const newJob:CreateJobDTO = {
                hemogramExam: newHemogramExam,
            }

            await this.jobService.create(newJob);

            FixLazyLoadingProps(newHemogramExam);
            FixLazyLoadingProps(newHemogramExam.status);


            return newHemogramExam
        }catch(err){
            throw err
        }
    }

    public async updateHemogramExamWithResults(hemogramExam: HemogramExamDTO, hemogramExamToUpdate: UpdateHemogramExamWithResultDTO): Promise<UpdateResponse> {
        try{
            await this.repository.update(hemogramExam.id, ({ cellCount: hemogramExamToUpdate.cellCount }));

            await this.createHemogramExamDocuments(
                hemogramExam,
                hemogramExamToUpdate.hemogramExamDocuments,
                true
            )
            
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

    private async createHemogramExamDocuments(hemogramHexam: HemogramExamDTO, documents: DocumentDTO[], isResult: boolean): Promise<HemogramExamDocumentDTO[]>{
        try{
            const hemogramExamDocumentEntities = documents.map(document => {
                const newHemogramExamDocumentEntity = new HemogramExamDocumentEntity();
                newHemogramExamDocumentEntity.document = document;
                newHemogramExamDocumentEntity.hemogramExam = hemogramHexam;
                newHemogramExamDocumentEntity.isResult = isResult;
                return newHemogramExamDocumentEntity
            })

            await this.hemogramExamDocumentRepository.save(hemogramExamDocumentEntities);

            return hemogramExamDocumentEntities
        }catch(err){
            throw err
        }
    }

    public async getAllForUser(currentUser: UserDTO): Promise<HemogramExamDTO[]> {

        try {

            const hemogramExamList = await this.repository.find({
                where:{
                    user:{
                        id: currentUser.id
                    }
                }
            });
            return hemogramExamList

        }catch(err) {
            throw err
        }
    }

    public override async getById(id: number, req: any, ignoreObjectOwner: boolean = false): Promise<HemogramExamDTO> {

        try {

            const foundedHemogramExam = await this.repository.findOne({
                where: {
                    id
                }
            });

            if(!foundedHemogramExam) {
                throw new HttpException(NotFoundLabel(this.entityName, this.isEntityMaleGender), HttpStatus.NOT_FOUND)
            }

            const hemogramExamUser = await foundedHemogramExam.user;

            if(!ignoreObjectOwner && !CheckAccessPermissionOnObject(hemogramExamUser.id, req)){
                throw new HttpException(InsuficientPernmissions(), HttpStatus.FORBIDDEN)
            }

            FixLazyLoadingProps(foundedHemogramExam);

            return foundedHemogramExam

        }catch(err) {
            throw err
        }
    }

    public override async updateById(
        id: number,
        hemogramExamToUpdate: UpdateHemogramExamDTO,
        req: any,
        ignoreObjectOwner: boolean = false
    ): Promise<UpdateResponse> {
        try{
            await this.getById(id, req, ignoreObjectOwner);

            await this.repository.update(id, ({ ...hemogramExamToUpdate }));
            
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

    public override async deactivateById(id: number, req: any): Promise<UpdateResponse>  {
        throw new HttpException(NotImplemented(), HttpStatus.NOT_IMPLEMENTED)
    } 

    public override async activateById(id: number, req: any): Promise<UpdateResponse> {
        throw new HttpException(NotImplemented(), HttpStatus.NOT_IMPLEMENTED)
    } 

}
