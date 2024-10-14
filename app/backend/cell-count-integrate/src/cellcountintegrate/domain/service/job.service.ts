import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    JobDTO,
    CreateJobDTO,
    UpdateJobDTO
} from '../../adapter/dto';
import { IndicatorEntity, JobEntity } from '../../domain/entity';
import {
    BaseService,
    EntityEnum,
    UpdateResponse,
    NotImplemented,
    IndicatorNotFoundLabel,
    FixLazyLoadingProps,
    ActionsEnum,
    ResponseStatuEnum,
    EntityActionPerformed,
    NotFoundLabel
} from '../../../utils';
import { IndicatorTypeNamesEnum, IndicatorTypesEnum, StatusEnum } from '../../../enums';
import { DI_ENVIRONMENT } from '../../../configs';
import { Enviroment } from '../../../configs/enviroment.type';

@Injectable()
export class JobService extends BaseService<JobEntity, JobDTO, CreateJobDTO, UpdateJobDTO> {
    
    protected override readonly entityName: string = EntityEnum.JOB;

    constructor(
        @InjectRepository(JobEntity)
        protected readonly repository: Repository<JobEntity>,

        @InjectRepository(IndicatorEntity)
        private readonly indicatorRepository: Repository<IndicatorEntity>,

        @Inject(DI_ENVIRONMENT) private readonly configService: Enviroment

    ) { 
        super(repository)
    }

    public override async create(jobToCreate: CreateJobDTO): Promise<JobEntity>{
        try {
            const newJob = this.repository.create({ ...jobToCreate });
            newJob.retryCount = this.configService.JOB_RETRY_COUNT;

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

            newJob.status = awaitingStatus;
            
            await this.repository.save(newJob);

            FixLazyLoadingProps(newJob);
            FixLazyLoadingProps(newJob.status);


            return newJob

        }catch(err){
            throw err
        }
    }

    public async getAllJobsForRunner(): Promise<JobDTO[]> {

        try {

            const maxRunningJobs = Number(this.configService.MAX_RUNNING_JOBS)
            const runningJobs = await this.repository.count({
                where: {
                    status: {
                        id: StatusEnum.RUNNING
                    }
                },
            })

            if(runningJobs >= maxRunningJobs){
                return []
            }

            const foundedJOb = await this.repository.find({
                where: {
                    status: {
                        id: StatusEnum.AWAITING
                    }
                },
                take: maxRunningJobs - runningJobs
            });

            return foundedJOb

        }catch(err) {
            throw err
        }
    } 

    public async getAllRunningJobs() :Promise<JobDTO[]>{
        try{
            const runningJobs = await this.repository.find({
                where: {
                    status: {
                        id: StatusEnum.RUNNING
                    }
                },
            })
    
            return runningJobs
        }catch(err){
            throw err
        }
    }

    public override async getById(id: number): Promise<JobDTO> {

        try {

            const foundedJOb = await this.repository.findOne({
                where: {
                    id
                }
            });

            if(!foundedJOb) {
                throw new HttpException(NotFoundLabel(this.entityName, this.isEntityMaleGender), HttpStatus.NOT_FOUND)
            }

            return foundedJOb

        }catch(err) {
            throw err
        }
    } 

    public override async updateById(id: number, jobToUpdate: UpdateJobDTO): Promise<UpdateResponse> {
        try{
            await this.getById(id);

            await this.repository.update(id, ({ ...jobToUpdate }));
            
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
