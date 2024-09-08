import { ApiHideProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested
} from "class-validator";
import { UserDTO } from '../../user';

export class DocumentDTO {

    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    fileName: string;

    @IsNotEmpty()
    @IsString()
    fileHash: string;

    @IsNotEmpty()
    @IsString()
    fileType: string;

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

export class CreateDocumentDTO {

    @IsNotEmpty()
    @IsString()
    fileName: string;

    @IsNotEmpty()
    @IsString()
    fileHash: string;

    @IsNotEmpty()
    @IsString()
    fileType: string;
}

export class UpdateDocumentDTO {

    @IsOptional()
    @IsString()
    fileName?: string;
}

export class DocumentDownloadResponseDTO {

    @IsNotEmpty()
    @IsString()
    fileName: string;

    @IsNotEmpty()
    @IsString()
    fileType: string;

    @IsNotEmpty()
    @IsString()
    base64File: string;
}