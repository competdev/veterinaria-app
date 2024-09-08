import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CredentialsDTO, JWTResponseDTO, JWTPayloadDTO } from '../DTO';
import { UserDTO, UserService } from '../../user';
import {
    ComparePassowrd,
    InvalidCredentials,
    FixLazyLoadingProps
} from '../../utils';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
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
            expiresIn: Number(this.configService.get<number>('JWT_EXPIRES_IN'))
        }

        return response
    }


}
