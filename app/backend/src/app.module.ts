import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InterceptorModule } from './interceptor';
import { UserModule } from './user';
import { AuthModule } from './auth';
import { IndicatorModule } from './indicator';
import { DocumentModule } from './document';
import { HemogramExamModule } from './hemogram-exam';
import { JobModule } from './job';
import { FacadeModule } from './facade';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async(configService: ConfigService) => ({
        type: 'mariadb',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: `${configService.get('DB_NAME')}`,
        synchronize: JSON.parse(configService.get('DB_SYNC')),
        logging: JSON.parse(configService.get('DB_LOG')),
        autoLoadEntities: true
      }),
      inject: [ConfigService]
    }),
    InterceptorModule,
    UserModule,
    AuthModule,
    IndicatorModule,
    DocumentModule,
    HemogramExamModule,
    JobModule,
    FacadeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
