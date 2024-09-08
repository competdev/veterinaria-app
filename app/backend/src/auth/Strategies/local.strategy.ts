import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService} from '../Service';
import { UserDTO } from '../../user';
import { GenerateDefaultErrorResponse } from '../../utils';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){

    constructor(
        private readonly authService: AuthService
    ){
        super({
            usernameField: 'email'
        })
    }

    public async validate(email: string, password: string): Promise<UserDTO> {
        try{
            const ValidUser = await this.authService.validateUser({ email, password });
            return ValidUser

        }catch(err: any){
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