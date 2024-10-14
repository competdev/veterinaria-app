import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { DI_ENVIRONMENT } from '../configs';
import { JWTPayloadDTO } from '../cellcountintegrate/adapter/dto';
import { Enviroment } from '../configs/enviroment.type';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy){

    constructor(
        @Inject(DI_ENVIRONMENT) configService: Enviroment
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.JWT_SECRET_KEY
        })
    }

    public async validate(jwtPayload: JWTPayloadDTO): Promise<JWTPayloadDTO> {
        return jwtPayload
    }
}