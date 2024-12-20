import { ApiHideProperty } from "@nestjs/swagger";
import { Exclude, Type } from "class-transformer";
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested
} from "class-validator";
import { UserDTO } from './user.dto';
import { DocumentDTO } from './document.dto';
import { StatusDTO } from './indicator.dto';


export class HemogramExamDTO {

    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    cellCount: number;

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => HemogramExamDocumentDTO)
    hemogramExamDocuments: HemogramExamDocumentDTO[]; 

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => StatusDTO)
    status: StatusDTO; 

    @ApiHideProperty()
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => UserDTO)
    user: Promise<UserDTO>; 

    @ApiHideProperty()
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => UserDTO)
    __user__?: UserDTO;
}

export class CreateHemogramExamDTO {

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested()
    @Type(() => DocumentDTO)
    hemogramExamDocuments: DocumentDTO[]; 
}

export class UpdateHemogramExamDTO {

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => StatusDTO)
    status?: StatusDTO; 
}

export class UpdateHemogramExamWithResultDTO {

    @IsNotEmpty()
    @IsString()
    cellCount: number;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested()
    @Type(() => DocumentDTO)
    hemogramExamDocuments: DocumentDTO[]; 
}

export class HemogramExamDocumentDTO {

    @Exclude()
    @ApiHideProperty()
    hemogramExamId: number;

    @Exclude()
    @ApiHideProperty()
    documentId: number;

    @ApiHideProperty()
    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => HemogramExamDTO)
    hemogramExam: HemogramExamDTO; 

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => DocumentDTO)
    document: DocumentDTO; 

    @IsOptional()
    @IsString()
    isResult: boolean;
}