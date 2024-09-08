import {
    IsNumber,
    IsNotEmpty,
    IsString,
    IsDate,
    IsObject,
    ValidateNested,
    IsOptional,
} from 'class-validator';
import { ResponseStatus, Actions } from '../Types'

export class DefaultResponse<T> {
    
    @IsNotEmpty()
    @IsNumber()
    statusCode: number;

    @IsNotEmpty()
    @IsString()
    message: ResponseStatus;

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    data: T;

    @IsNotEmpty()
    @IsDate()
    time: Date;
}

export class UpdateResponse {

    @IsNotEmpty()
    @IsString()
    action: Actions;

    @IsNotEmpty()
    @IsString()
    status: ResponseStatus;

    @IsNotEmpty()
    @IsString()
    message: string;

    @IsOptional()
    @IsNumber()
    count?: number;
}

