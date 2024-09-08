import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { AWSError, S3 } from 'aws-sdk';
import { DocumentDTO, CreateDocumentDTO, UpdateDocumentDTO, DocumentDownloadResponseDTO } from '../DTO';
import { DocumentEntity } from '../Entity';
import {
    BaseService,
    CheckAccessPermissionOnObject,
    EntityEnum,
    FixLazyLoadingProps,
    InsuficientPernmissions,
    NotFoundLabel,
} from '../../utils';

@Injectable()
export class DocumentService extends BaseService<DocumentEntity, DocumentDTO, CreateDocumentDTO, UpdateDocumentDTO>{
    protected override readonly entityName: string = EntityEnum.DOCUMENT;

    constructor(
        @InjectRepository(DocumentEntity)
        protected readonly repository: Repository<DocumentEntity>,
        private readonly configService: ConfigService
    ) { 
        super(repository);
    }

    private getStorage(): S3{
        return new S3({
            accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
            secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
        })
    }

    public async uploadFile(file: Express.Multer.File, req: any): Promise<DocumentDTO>{
        try{
            const fileSeparetedByDots = file.originalname.split('.');
            const fileType = fileSeparetedByDots[fileSeparetedByDots.length - 1];
            const rawFileName = file.originalname.replace(`.${fileType}`, '');
            const fileHash = `cellCouter_usr_${req.user.id}_${new Date().getTime()}.${fileType}`;

            const storage = this.getStorage();

            await new Promise<S3.Types.ManagedUpload.SendData>((resolve, reject) => {
                return storage.upload({
                  Bucket: this.configService.get('AWS_S3_BUCKET'),
                  Key: fileHash,
                  Body: file.buffer
                }, (err: Error, data: S3.Types.ManagedUpload.SendData) => {
                    if (err) {
                      reject(new HttpException(err.message, HttpStatus.BAD_REQUEST));
                    }
          
                    resolve(data);
                });
            });
          

            const documentToCreate: CreateDocumentDTO = {
                fileName: rawFileName,
                fileHash: fileHash,
                fileType: fileType
            }

            const response = await this.createDocument(documentToCreate, req);
            return response

        }catch(err){
            throw err
        }
    }

    public async uploadResponseFile(fileArrayBuffer: Buffer, req: any): Promise<DocumentDTO>{
        try{
            const fileType = 'jpg';
            const fileName = `cellCouter_usr_${req.user.id}_${new Date().getTime()}`
            const fileHash = `${fileName}.${fileType}`;

            const storage = this.getStorage();

            await new Promise<S3.Types.ManagedUpload.SendData>((resolve, reject) => {
                return storage.upload({
                  Bucket: this.configService.get('AWS_S3_BUCKET'),
                  Key: fileHash,
                  Body: fileArrayBuffer
                }, (err: Error, data: S3.Types.ManagedUpload.SendData) => {
                    if (err) {
                      reject(new HttpException(err.message, HttpStatus.BAD_REQUEST));
                    }
          
                    resolve(data);
                });
            });

            const documentToCreate: CreateDocumentDTO = {
                fileName: fileName,
                fileHash: fileHash,
                fileType: fileType
            }

            const response = await this.createDocument(documentToCreate, req);
            return response

        }catch(err){
            throw err
        }
    }

    public async downloadFile(documentId: number, req: any, ignoreObjectOwner: boolean = false): Promise<DocumentDownloadResponseDTO> {
        try{
            const foundedDocument = await this.getById(documentId, req, ignoreObjectOwner);

            const storage = this.getStorage();

            const downloadResponse = await new Promise<S3.Types.GetObjectOutput>((resolve, reject) => {
                return storage.getObject({
                    Bucket: this.configService.get('AWS_S3_BUCKET'),
                    Key: foundedDocument.fileHash
                }, (err: AWSError, data: S3.Types.GetObjectOutput) => {
                    if (err) {
                        reject(new HttpException(err.message, HttpStatus.BAD_REQUEST));
                    }
            
                    resolve(data);
                })
            })
            
            const buffer = Buffer.from(downloadResponse.Body as Buffer);
            const base64File = buffer.toString('base64');

            const response:DocumentDownloadResponseDTO = {
                fileName: foundedDocument.fileName,
                fileType: foundedDocument.fileType,
                base64File: base64File
            }
            
            return response
        }catch(err){
            throw err
        }
    }

    public override async getById(id: number, req: any, ignoreObjectOwner: boolean = false): Promise<DocumentDTO> {

        try {

            const foundedDocument = await this.repository.findOne({
                where: {
                    id
                }
            });

            if(!foundedDocument) {
                throw new HttpException(NotFoundLabel(this.entityName, this.isEntityMaleGender), HttpStatus.NOT_FOUND)
            }

            const documentUser = await foundedDocument.user;

            if(!ignoreObjectOwner && !CheckAccessPermissionOnObject(documentUser.id, req)){
                throw new HttpException(InsuficientPernmissions(), HttpStatus.FORBIDDEN)
            }

            FixLazyLoadingProps(foundedDocument);

            return foundedDocument

        }catch(err) {
            throw err
        }
    }

    private async createDocument(documentToCreate: CreateDocumentDTO, req: any): Promise<DocumentDTO>{
        try {
            const newDocument = this.repository.create(documentToCreate);
            newDocument.user = Promise.resolve(req.user);
            await this.repository.save(newDocument);
            FixLazyLoadingProps(newDocument);
            return newDocument
        }catch(err){
            throw err
        }
    }
}
