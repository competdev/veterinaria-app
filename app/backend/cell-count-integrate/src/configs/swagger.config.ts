import { DocumentBuilder } from "@nestjs/swagger";
import { env } from "./environement.config";

export const swaggerConfig = new DocumentBuilder()
	.setTitle("cell_count_integrate")
	.setVersion(process.env["npm_package_version"])
	.setDescription(process.env["npm_package_description"])
	.addServer(`http://localhost:${env.API_PORT.toString()}`, "localhost")
	.addBearerAuth()
	.setContact(process.env["SWAGGER_CONTACT_NAME"], "", process.env["SWAGGER_CONTACT_EMAIL"])
	.build();
