import { Type } from "class-transformer";
import {
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested
} from "class-validator";
import { StatusDTO } from '../../indicator';
import { HemogramExamDTO } from '../../hemogram-exam';

export class JobDTO {

    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsNumber()
    errorCount: number;

    @IsNotEmpty()
    @IsNumber()
    retryCount: number;

    @IsOptional()
    @IsString()
    statusReason: string;

    @IsNotEmpty()
    @IsDate()
    createDate: Date;

    @IsNotEmpty()
    @IsDate()
    updateDate: Date;

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => StatusDTO)
    status: StatusDTO; 

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => HemogramExamDTO)
    hemogramExam: HemogramExamDTO; 
}

export class CreateJobDTO{

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => HemogramExamDTO)
    hemogramExam: HemogramExamDTO; 
}

export class UpdateJobDTO {

    @IsOptional()
    @IsNumber()
    errorCount?: number;

    @IsOptional()
    @IsString()
    statusReason?: string;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => StatusDTO)
    status?: StatusDTO; 
}