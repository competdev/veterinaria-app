import { Type } from 'class-transformer';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsString,
    ValidateNested
} from 'class-validator';
import { UserDTO } from '../../user';
import { RoleDTO } from '../../indicator';

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