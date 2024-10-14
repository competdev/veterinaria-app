import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import axios, { AxiosInstance, AxiosError } from "axios";
import { GetCellCountRequestDTO, GetCellCountResponseDTO, GetCellCountResponseSchema } from "../DTO";
import { DI_ENVIRONMENT } from "../../configs";
import { Enviroment } from "../../configs/enviroment.type";

@Injectable()
export class CellCounterService {
	constructor(@Inject(DI_ENVIRONMENT) private readonly configService: Enviroment) {}

	private cellCounter(): AxiosInstance {
		const axiosInstance = axios.create({
			baseURL: this.configService.CELL_COUNTER_URL,
			timeout: Number(this.configService.CELL_COUNTER_TIMEOUT),
		});

		return axiosInstance;
	}

	public async getCellCount(body: GetCellCountRequestDTO): Promise<GetCellCountResponseDTO> {
		try {
			const response = await this.getCellCountAPICall(body);
			return response;
		} catch (err: any) {
			if (err instanceof HttpException) {
				throw err;
			}

			throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
		}
	}

	private async getCellCountAPICall(body: GetCellCountRequestDTO): Promise<GetCellCountResponseDTO> {
		try {
			const response = await this.cellCounter()
				.post<GetCellCountResponseDTO>(``, body)
				.then((res) => {
					return GetCellCountResponseSchema.parse(res.data);
				})
				.catch((err: any) => {
					if (err instanceof AxiosError) {
						throw new HttpException(err.response.data, err.response.status);
					}

					throw new HttpException(err, HttpStatus.UNPROCESSABLE_ENTITY);
				});

			return response;
		} catch (err) {
			throw err;
		}
	}
}
