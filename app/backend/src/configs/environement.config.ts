import { z } from "zod";
import { Enviroment } from "./enviroment.type";

export const envSchema = z.object({
	API_PORT: z.coerce.number(),
	API_VERSION: z.string(),
	ENABLE_SWAGGER: z.coerce.boolean(),
	DB_HOST: z.string(),
	DB_PORT: z.coerce.number(),
	DB_USER: z.string(),
	DB_PASSWORD: z.string(),
	DB_NAME: z.string(),
	DB_SYNC: z.coerce.boolean(),
	DB_LOG: z.coerce.boolean(),
	JWT_SECRET_KEY: z.string(),
	AWS_ACCESS_KEY: z.string(),
	AWS_SECRET_ACCESS_KEY: z.string(),
	AWS_S3_BUCKET: z.string(),
	JWT_EXPIRES_IN: z.string(),
	JOB_RETRY_COUNT: z.coerce.number(),
	MAX_RUNNING_JOBS: z.coerce.number(),
	JOB_TIMEOUT: z.coerce.number(),
	CELL_COUNTER_URL: z.string(),
	CELL_COUNTER_TIMEOUT: z.coerce.number(),
});

const _env = envSchema.safeParse(process.env); // tenta validar process.env para ver se tem as exatas informações dentro

if (_env.success === false) {
	console.error("Invalid environment variables", _env.error.format()); // formata todos os erros ali

	throw new Error("Invalid environment variables");
}

console.log("Environment Variables: valid");

export const env: Enviroment = _env.data;
