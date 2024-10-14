import { CallHandler, ExecutionContext, Logger, NestInterceptor } from "@nestjs/common";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { Request, Response } from "express";
import { Observable } from "rxjs";
import { env } from "../configs";

export class EndpointLoggerInterceptor implements NestInterceptor {
	private static readonly logger = new Logger(EndpointLoggerInterceptor.name);

	public intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
		const httpContext: HttpArgumentsHost = context.switchToHttp();

		const request: Request = httpContext.getRequest();
		this.logRequest(request);

		const response: Response = httpContext.getResponse();
		response.on("close", () => {
			this.logResponse(request, response);
		});

		return next.handle();
	}

	private logRequest(request: Request): void {
		const requestData: object = {
			params: request.params,
			query: request.query,
			body: request.body,
		};

		EndpointLoggerInterceptor.logger.debug(
			`[REQUEST] Received from IP=${request.ip} at PATH=${request.path} using METHOD=${request.method} and API_VERSION=${env.API_VERSION}`,
			requestData,
		);
	}

	private logResponse(request: Request, response: Response): void {
		const responseData: object = {
			statusCode: response.statusCode,
			contentType: response.getHeader("content-type"),
			contentLength: response.getHeader("content-length"),
		};

		EndpointLoggerInterceptor.logger.debug(
			`[RESPONSE] Sended to IP=${request.ip} using PATH=${request.path} and API_VERSION=${env.API_VERSION}`,
			responseData,
		);
	}
}
