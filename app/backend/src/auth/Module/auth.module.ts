import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../Service';
import { AuthController } from '../Controller';
import { LocalStrategy, JWTStrategy } from '../Strategies';
import { UserModule } from '../../user';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async(configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: Number(configService.get<number>('JWT_EXPIRES_IN')),
        }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JWTStrategy
  ],
  controllers: [AuthController]
})
export class AuthModule {}
