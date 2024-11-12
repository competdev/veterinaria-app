import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Inject,
	Param,
	Post,
	Put,
	Request,
	UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { BaseController, NothingToUpdate, RequestParamsDTO, UpdateResponse } from "../../../utils";
import { UserEntity } from "../../domain/entity";
import { CreateUserDTO, RoleDTO, UpdateUserDTO, UserDTO } from "../dto";
import { UserService } from "../../domain/service";
import { JwtGuard, RoleGuard } from "../../../auth/guard";
import { RolesEnum } from "../../../enums";
import { Roles } from "../../../decorator";
import { DI_USERSERVICE } from "../../../configs";

@ApiTags("User")
@Controller("user")
export class UserController extends BaseController<UserEntity, UserDTO, CreateUserDTO, UpdateUserDTO> {
	constructor(@Inject(DI_USERSERVICE) protected readonly service: UserService) {
		super(service);
	}

	@Post()
	public override async create(@Body() entityToCreate: CreateUserDTO): Promise<UserDTO> {
		try {
			const response = await this.service.create(entityToCreate);
			return response;
		} catch (err) {
			throw err;
		}
	}

	@Get("/role")
	public async getAvaliableRoles(): Promise<RoleDTO[]> {
		try {
			const response = await this.service.getAvaliableRoles();
			return response;
		} catch (err) {
			throw err;
		}
	}

	// @Get("/newRole")
	// public async getNewRole(): Promise<RoleDTO> {
	// 	// TODO: Implement this method
	// }

	@ApiBearerAuth()
	@UseGuards(JwtGuard, RoleGuard)
	@Roles(RolesEnum.ADMIN_ROLE, RolesEnum.PROFESSOR_ROLE, RolesEnum.STUDENT_ROLE)
	@Put(":id")
	public override async updateById(
		@Param() requestParam: RequestParamsDTO,
		@Body() userToUpdate: UpdateUserDTO,
		@Request() req,
	): Promise<UpdateResponse> {
		try {
			if (!Object.keys(userToUpdate).length) {
				throw new HttpException(NothingToUpdate(), HttpStatus.BAD_REQUEST);
			}

			const response = await this.service.updateById(requestParam.id, userToUpdate, req);
			return response;
		} catch (err) {
			throw err;
		}
	}
}
