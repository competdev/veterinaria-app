import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GenerateDefaultErrorResponse } from 'src/utils';
import { UserDTO } from '../../user';
import { JWTPayloadDTO } from '../DTO';

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt'){

    handleRequest<TUser = UserDTO>(err: any, jwtPayload: JWTPayloadDTO, info: any, context: ExecutionContext): TUser {    
        const { user, roles } = jwtPayload;
        const req = context.switchToHttp().getRequest();
        req.roles = roles;

        if(err || !user){
            throw err || GenerateDefaultErrorResponse(
                HttpStatus.UNAUTHORIZED,
                {
                    message: info.message
                }
            )
        }

        return user as TUser
    }
}