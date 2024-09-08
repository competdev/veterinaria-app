import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule, SwaggerCustomOptions } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { config } from 'dotenv';

config();

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, 
    transform: true,
    forbidUnknownValues: true,
    whitelist: true,
  }));
  const swaggerConfig = new DocumentBuilder()
  .setTitle('Backend - Cells Count app')
  .setDescription('API feita por Thiago Danilo para fornercer suporte ao aplicativop Cell-ia como proposta de TCC dio curso de Engenharia da Computaçao do Centro Federal de Educação Tecnológica de Minas Gerais - CEFET-MG')
  .addBearerAuth()
  .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  const swaggerCustomOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true
    },
    customSiteTitle: 'cellscountapi',
    useGlobalPrefix: true
  }
  SwaggerModule.setup('swagger', app, swaggerDocument, swaggerCustomOptions);
  await app.listen(Number(process.env.API_PORT));
}
bootstrap();
