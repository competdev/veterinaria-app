import { Test } from "@nestjs/testing"
import { AppModule } from "../src/app.module";
import { ClassSerializerInterceptor, HttpStatus, INestApplication, ValidationPipe, VersioningType } from "@nestjs/common";
import { EndpointLoggerInterceptor, GenericExceptionFilter, HttpExceptionFilter } from "../src/filter";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "../src/cellcountintegrate/prisma/prisma.service";
import * as pactum from "pactum";
import { AuthDto } from "../src/cellcountintegrate/adapter/dto";

describe("App e2e test", () => {
	let app: INestApplication; // variável para armazenar a aplicação
	let prisma: PrismaService; // variável para armazenar o serviço do Prisma

	// Antes de todos os testes, cria a aplicação
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile(); // compila o módulo

		// cria a aplicação
		app = moduleRef.createNestApplication();

		// configurações da aplicação
		app.enableVersioning({ type: VersioningType.URI });

		// configuração de interceptadores e filtros
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				forbidUnknownValues: true,
				transform: true,
				transformOptions: {
					enableImplicitConversion: true,
				},
			}),
		);

		app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
		app.useGlobalInterceptors(new EndpointLoggerInterceptor());
		app.useGlobalFilters(new GenericExceptionFilter(), new HttpExceptionFilter());

		// inicializa a aplicação
		await app.init();

		// inicia a aplicação na porta 3333 e configura o pactum para usar essa porta
		await app.listen(3333);
		pactum.request.setBaseUrl("http://localhost:3333");

		// pega o serviço do Prisma para ser usado nos testes
		prisma = app.get(PrismaService);

		// limpa o banco de dados
		await prisma.cleanDb();
	});

	// Depois de todos os testes, fecha a aplicação
	afterAll(async () => {
		await app.close();
	});

	describe("Auth", () => {
		const dto: AuthDto = {
			email: "gremioMaiorDoSul@gmail.com",
			password: "1983melhordomundo",
		};
		describe("SignUp", () => {

			it("should throw error when email is empty", () => {
				return pactum
					.spec()
					.post(
						"/auth/signup"
					)
					.withBody({
						email: "",
						password: dto.password,
					})
					.expectStatus(400);
			});

			it("should throw error when password is empty", () => {
				return pactum
					.spec()
					.post(
						"/auth/signup"
					)
					.withBody({
						email: dto.email,
						password: "",
					})
					.expectStatus(400);
			});

			it("should throw if no body is sent", () => {
				return pactum
					.spec()
					.post(
						"/auth/signup"
					)
					.expectStatus(400);
			});

			it("should create a new user", () => {
				return pactum
					.spec()
					.post(
						"/auth/signup"
					)
					.withBody(dto)
					.expectStatus(HttpStatus.CREATED);
			});
		});

		describe("SignIn", () => {

			it("should throw error when email is empty", () => {
				return pactum
					.spec()
					.post(
						"/auth/signin"
					)
					.withBody({
						email: "",
						password: dto.password,
					})
					.expectStatus(400);
			});

			it("should throw error when password is empty", () => {
				return pactum
					.spec()
					.post(
						"/auth/signin"
					)
					.withBody({
						email: dto.email,
						password: "",
					})
					.expectStatus(400);
			});

			it("should throw if no body is sent", () => {
				return pactum
					.spec()
					.post(
						"/auth/signin"
					)
					.expectStatus(400);
			});

			it("should signin", () => {
				return pactum
					.spec()
					.post(
						"/auth/signin"
					)
					.withBody(dto)
					.expectStatus(HttpStatus.OK)
					.stores("token", "access_token");
			});
		});
	});
});