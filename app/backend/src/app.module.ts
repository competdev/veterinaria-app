import { Module } from "@nestjs/common";
import { CellCountIntegrateModule } from "./cellcountintegrate/cellcountintegrate.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { env } from "./configs";

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: async () => ({
				type: "mariadb",
				host: env.DB_HOST,
				port: env.DB_PORT,
				username: env.DB_USER,
				password: env.DB_PASSWORD,
				database: env.DB_NAME,
				synchronize: env.DB_SYNC,
				logging: env.DB_LOG,
				autoLoadEntities: true,
			}),
		}),
		CellCountIntegrateModule,
	],
})
export class AppModule {}
