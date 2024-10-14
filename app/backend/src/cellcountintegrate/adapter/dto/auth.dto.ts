import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
	@IsEmail() //AuthDto garante que o email é um email válido
    @IsNotEmpty() //AuthDto garante que o email não é vazio
    email: string;

    @IsString() //AuthDto garante que a senha é uma string
    @IsNotEmpty() //AuthDto garante que a senha não é vazia
	password: string;
}
