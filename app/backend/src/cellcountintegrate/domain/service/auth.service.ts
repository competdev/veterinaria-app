import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CredentialsDTO, JWTResponseDTO, JWTPayloadDTO } from '../../adapter/dto';
import {
    ComparePassowrd,
    InvalidCredentials,
    FixLazyLoadingProps
} from '../../../utils';
import { UserService } from './user.service';
import { UserDTO } from '../../adapter/dto';
import { DI_ENVIRONMENT, DI_USERSERVICE } from '../../../configs';
import { Enviroment } from '../../../configs/enviroment.type';

@Injectable()
export class AuthService {

    constructor(
        @Inject(DI_USERSERVICE) private readonly userService: UserService,
        private readonly jwtService: JwtService,
        @Inject(DI_ENVIRONMENT) private readonly configService: Enviroment

    ){}

    public async validateUser(userCredentials: CredentialsDTO): Promise<UserDTO> {
        try{
            const foundedUser = await this.userService.findUserByEmailWithPassword(userCredentials.email);

            if(!foundedUser.active){
                throw new HttpException(InvalidCredentials(), HttpStatus.UNAUTHORIZED)
            }

            if(! (await ComparePassowrd(userCredentials.password, foundedUser.password))){
                throw new HttpException(InvalidCredentials(), HttpStatus.UNAUTHORIZED)
            }

            delete foundedUser.password;
            return foundedUser

        }catch(err: any){
            if(err instanceof HttpException){
                if(err.getStatus() === HttpStatus.NOT_FOUND){
                    throw new HttpException(InvalidCredentials(), HttpStatus.UNAUTHORIZED)
                }
            }
            throw err
        }
    }

    public async login(currentUser: UserDTO): Promise<JWTResponseDTO>{
        const response = await this.generateJWT(currentUser);
        return response
    }

    public async refreshJWT(currentUser: UserDTO){
        try{
            const foundedUser = await this.userService.getByIdNonProtected(currentUser.id);

            if(!foundedUser.active){
                throw new HttpException(InvalidCredentials(), HttpStatus.UNAUTHORIZED)
            }

            const response = await this.generateJWT(foundedUser);
            return response

        }catch(err){
            throw err
        }
    }

    private async generateJWT(currentUser: UserDTO): Promise<JWTResponseDTO>{
        const userRoles = await currentUser.roles;

        FixLazyLoadingProps(currentUser);

        const jwtPayload: JWTPayloadDTO = {
            user: currentUser,
            roles: userRoles
        }

        const authToken = this.jwtService.sign(jwtPayload);

        const response: JWTResponseDTO = {
            ...jwtPayload,
            authToken,
            expiresIn: Number(this.configService.JWT_EXPIRES_IN)
        }

        return response
    }


}
