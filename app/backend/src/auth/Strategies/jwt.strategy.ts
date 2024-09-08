import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JWTPayloadDTO } from '../DTO';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy){

    constructor(
        private readonly configService: ConfigService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: (arguments[0] as ConfigService).get<string>('JWT_SECRET_KEY')
        })
    }

    public async validate(jwtPayload: JWTPayloadDTO): Promise<JWTPayloadDTO> {
        return jwtPayload
    }
}