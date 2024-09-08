import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsNumber,
    IsString,
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    ValidateNested,
    IsArray,
} from 'class-validator'
import { RoleDTO } from '../../indicator';

export class UserDTO {

    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsBoolean()
    @IsNotEmpty()
    active: boolean;

    @IsNotEmpty()
    @IsOptional()
    @IsArray()
    @ValidateNested()
    @Type(() => RoleDTO)
    roles: Promise<RoleDTO[]>;

    @ApiHideProperty()
    @IsOptional()
    @IsArray()
    @ValidateNested()
    @Type(() => RoleDTO)
    __roles__?: RoleDTO[];

}

export class CreateUserDTO {

    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested()
    @Type(() => RoleDTO)
    roles: RoleDTO[];

}

export class UpdateUserDTO {

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    password?: string;
    
}

