import { Type } from 'class-transformer';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsString,
    ValidateNested
} from 'class-validator';
import { UserDTO } from '../dto';
import { RoleDTO } from '../dto';

export class JWTPayloadDTO {
    
    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => UserDTO)
    user: UserDTO;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested()
    roles: RoleDTO[];
}

export class JWTResponseDTO {

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => UserDTO)
    user: UserDTO;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested()
    roles: RoleDTO[];

    @IsNotEmpty()
    @IsString()
    authToken: string;

    @IsNotEmpty()
    @IsNumber()
    expiresIn: number
}