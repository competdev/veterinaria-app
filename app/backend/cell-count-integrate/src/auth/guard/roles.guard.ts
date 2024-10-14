import {
    CanActivate,
    ExecutionContext,
    HttpStatus,
    Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GenerateDefaultErrorResponse, InsuficientPernmissions } from '../../utils';
import { ROLES_KEY } from '../../decorator';
import { RoleDTO } from '../../cellcountintegrate/adapter/dto';
import { RolesEnum } from '../../enums';


@Injectable()
export class RoleGuard implements CanActivate{

    constructor(
        private readonly reflector: Reflector
    ){}

    canActivate(context: ExecutionContext): boolean {

        const requiredRoles = this.reflector.getAllAndOverride<RolesEnum[]>(
            ROLES_KEY,
            [
                context.getHandler(),
                context.getClass()
            ]
        )

        if(!requiredRoles){
            return false
        }

        const currentRoles = context.switchToHttp().getRequest().roles as RoleDTO[];

        const hasRole = requiredRoles.some(requiredRole => {
            return currentRoles.some(currentRole => currentRole.id === requiredRole && currentRole.active)
        })

        if(!hasRole){
            throw GenerateDefaultErrorResponse(
                HttpStatus.FORBIDDEN,
                {
                    message: InsuficientPernmissions()
                }
            )
        }

        return hasRole
    }
    
}