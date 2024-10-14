import { Module } from "@nestjs/common";
import { AuthController } from "./adapter/controller/auth.controller";
import { AuthService } from "./domain/service/auth.service";
import { JwtModule } from "@nestjs/jwt";
import { DI_AUTHSERVICE, DI_DOCUMENTSERVICE, DI_ENVIRONMENT, DI_HEMOGRAMEXAMSERVICE, DI_JOBSERVICE, DI_USERENTITYSUBSCRIBER, DI_USERSERVICE, env } from "../configs";
import { JWTStrategy } from "../auth";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
	DocumentEntity,
	HemogramExamDocumentEntity,
	HemogramExamEntity,
	IndicatorEntity,
	IndicatorTypeEntity,
	JobEntity,
	UserEntity,
	UserEntitySubscriber,
} from "./domain/entity";
import { DocumentController } from "./adapter/controller/document.controller";
import { DocumentService, HemogramExamService, JobService, UserService } from "./domain/service";
import { HemogramExamController } from "./adapter/controller/hemogram-exam.controller";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { TransformInterceptor } from "../filter";
import { UserController } from "./adapter/controller/user.controller";

@Module({
	imports: [
		JwtModule.register({}),
		TypeOrmModule.forFeature([DocumentEntity]),
		TypeOrmModule.forFeature([HemogramExamEntity, HemogramExamDocumentEntity]),
		TypeOrmModule.forFeature([IndicatorEntity, IndicatorTypeEntity]),
		TypeOrmModule.forFeature([JobEntity]),
		TypeOrmModule.forFeature([UserEntity]),
	],
	controllers: [AuthController, DocumentController, HemogramExamController, UserController],
	providers: [
		{
			provide: DI_AUTHSERVICE,
			useClass: AuthService,
		},
		{
			provide: DI_ENVIRONMENT,
			useValue: env
		},
		JWTStrategy,
		{
			provide: DI_DOCUMENTSERVICE,
			useClass: DocumentService,
		},
		{
			provide: DI_HEMOGRAMEXAMSERVICE,
			useClass: HemogramExamService,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformInterceptor,
		},
		{
			provide: DI_JOBSERVICE,
			useClass: JobService,
		},
		{
			provide: DI_USERSERVICE,
			useClass: UserService,
		},
		{
			provide: DI_USERENTITYSUBSCRIBER,
			useClass: UserEntitySubscriber,
		},
	],
})
export class CellCountIntegrateModule {}
