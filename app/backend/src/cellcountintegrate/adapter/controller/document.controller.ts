import { HttpStatus, Inject, Param, UseGuards } from "@nestjs/common";
import { Controller, Get, Post, Request, UploadedFile, UseInterceptors, ParseFilePipeBuilder } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { Express } from "express";
import { RolesEnum } from "../../../enums";
import { DocumentService } from "../../domain/service";
import { DocumentDownloadResponseDTO, DocumentDTO } from "../dto";
import { RequestParamsDTO } from "../../../utils";
import { JwtGuard, RoleGuard } from "../../../auth/guard";
import { Roles } from "../../../decorator";
import { DI_DOCUMENTSERVICE } from "../../../configs";

@ApiTags("Document")
@Controller("document")
export class DocumentController {
	constructor(
		@Inject(DI_DOCUMENTSERVICE) private readonly documentService: DocumentService
	) {}

	@ApiBearerAuth()
	@ApiConsumes("multipart/form-data")
	@ApiBody({
		schema: {
			type: "object",
			properties: {
				file: {
					type: "string",
					format: "binary",
				},
			},
		},
	})
	@UseGuards(JwtGuard, RoleGuard)
	@Roles(RolesEnum.ADMIN_ROLE, RolesEnum.PROFESSOR_ROLE, RolesEnum.STUDENT_ROLE)
	@Post("upload")
	@UseInterceptors(FileInterceptor("file"))
	public async uploadDocument(
		@UploadedFile(
			new ParseFilePipeBuilder()
				.addFileTypeValidator({
					fileType: "image/jpeg",
				})
				.build({
					errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
				}),
		)
        //TODO: fix Multer.File type
		file: Express.Multer.File,
		@Request() req,
	): Promise<DocumentDTO> {
		try {
			const response = await this.documentService.uploadFile(file, req);
			return response;
		} catch (err) {
			throw err;
		}
	}

	@ApiBearerAuth()
	@UseGuards(JwtGuard, RoleGuard)
	@Roles(RolesEnum.ADMIN_ROLE, RolesEnum.PROFESSOR_ROLE, RolesEnum.STUDENT_ROLE)
	@Get("download/:id")
	public async downloadDocument(
		@Param() requestParam: RequestParamsDTO,
		@Request() req,
	): Promise<DocumentDownloadResponseDTO> {
		try {
			const response = await this.documentService.downloadFile(requestParam.id, req);
			return response;
		} catch (err) {
			throw err;
		}
	}
}
