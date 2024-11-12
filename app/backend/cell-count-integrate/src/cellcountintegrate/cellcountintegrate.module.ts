import { Module } from "@nestjs/common";
import { AuthController } from "./adapter/controller/auth.controller";
import { AuthService } from "./domain/service/auth.service";
import { JwtModule } from "@nestjs/jwt";
import {
	DI_AUTHSERVICE,
	DI_CELLCOUNTERSERVICE,
	DI_DOCUMENTSERVICE,
	DI_ENVIRONMENT,
	DI_HEMOGRAMEXAMSERVICE,
	DI_JOBRUNNERSERVICE,
	DI_JOBSERVICE,
	DI_USERENTITYSUBSCRIBER,
	DI_USERSERVICE,
	env	
} from "../configs";
import { JWTStrategy, LocalStrategy } from "../auth";
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
import { JobRunnerService } from "./domain/service/job-runner.service";
import { CellCounterService } from "../utils";
import { ScheduleModule } from "@nestjs/schedule";
import { PassportModule } from "@nestjs/passport";

@Module({
	imports: [
		PassportModule,
		JwtModule.register({
				global: true,
				secret: "G4HemCMOevD!TRhZT9k*tbiWI1dzSa8OtZ6*oext8RQ&!uSzE@",
				signOptions: {
					expiresIn: 3600,
			},
		}),
		TypeOrmModule.forFeature([DocumentEntity]),
		TypeOrmModule.forFeature([HemogramExamEntity, HemogramExamDocumentEntity]),
		TypeOrmModule.forFeature([IndicatorEntity, IndicatorTypeEntity]),
		TypeOrmModule.forFeature([JobEntity]),
		TypeOrmModule.forFeature([UserEntity]),
		ScheduleModule.forRoot(),
	],
	controllers: [AuthController, DocumentController, HemogramExamController, UserController],
	providers: [
		{
			provide: DI_AUTHSERVICE,
			useClass: AuthService,
		},
		{
			provide: DI_ENVIRONMENT,
			useValue: env,
		},
		JWTStrategy,
		LocalStrategy,
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
		{
			provide: DI_JOBRUNNERSERVICE,
			useClass: JobRunnerService,
		},
		{
			provide: DI_CELLCOUNTERSERVICE,
			useClass: CellCounterService,
		},
	],
})
export class CellCountIntegrateModule {}
