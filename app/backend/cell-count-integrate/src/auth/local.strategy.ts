import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../cellcountintegrate/domain/service';
import { Strategy } from 'passport-local';
import { UserDTO } from '../cellcountintegrate/adapter/dto';
import { GenerateDefaultErrorResponse } from '../utils';
import { DI_AUTHSERVICE } from '../configs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){

    constructor(
        @Inject(DI_AUTHSERVICE) private readonly authService: AuthService
    ){
        super()
    }

    public async validate(email: string, password: string): Promise<UserDTO> {
        try{
            const ValidUser = await this.authService.validateUser({ email, password });
            return ValidUser

        }catch(err: any){
            console.log(err)
            const errorData = typeof err.getResponse() === 'string' ? 
            {
                message: err.getResponse()
            } : err.getResponse()

            const errorResponse = GenerateDefaultErrorResponse(
                err.getStatus(),
                { ... errorData }
            )

            throw errorResponse
        }
    }
}