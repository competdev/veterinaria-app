import "dotenv/config";
import { expand } from "dotenv-expand";
expand({ parsed: process.env });

import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ClassSerializerInterceptor, INestApplication, ValidationPipe, VersioningType } from "@nestjs/common";
import { SwaggerModule } from "@nestjs/swagger";
import { EndpointLoggerInterceptor, GenericExceptionFilter, HttpExceptionFilter } from "./filter";
import { env, swaggerConfig } from "./configs";

function customBootstrapConfig(app: INestApplication): void {
	app.enableVersioning({ type: VersioningType.URI });

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true, // remove unknown properties
			forbidUnknownValues: true, // joga um erro se tiver um valor desconhecido
			transform: true, // transforma os valores recebidos
			transformOptions: {
				enableImplicitConversion: true, // transforma os valores recebidos para o tipo esperado
			},
		}),
	);

	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
	app.useGlobalInterceptors(new EndpointLoggerInterceptor()); // intercepta as requisições
	app.useGlobalFilters(new GenericExceptionFilter(), new HttpExceptionFilter()); // intercepta os erros
}

function setupSwagger(app: INestApplication) {
	if (!env.ENABLE_SWAGGER) return;

	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup("api", app, document);
}

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	customBootstrapConfig(app);
	setupSwagger(app);

	await app.listen(env.API_PORT);
}

bootstrap();
