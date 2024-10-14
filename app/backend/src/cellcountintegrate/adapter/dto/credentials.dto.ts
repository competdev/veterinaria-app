import {
    IsEmail,
    IsString,
    IsNotEmpty
} from 'class-validator'


export class CredentialsDTO {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}