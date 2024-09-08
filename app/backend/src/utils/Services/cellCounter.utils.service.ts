import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosError } from 'axios';
import {
    GetCellCountRequestDTO,
    GetCellCountResponseDTO,
    GetCellCountResponseSchema
} from '../DTO';

@Injectable()
export class CellCounterService {

    constructor(
        private readonly configService: ConfigService
    ){}

    private cellCounter(): AxiosInstance{

        const axiosInstance = axios.create({
            baseURL: this.configService.get('CELL_COUNTER_URL'),
            timeout: Number(this.configService.get('CELL_COUNTER_TIMEOUT')),
        })

        return axiosInstance
    }

    public async getCellCount(body: GetCellCountRequestDTO): Promise<GetCellCountResponseDTO>{
        try {
            const response = await this.getCellCountAPICall(body);
            return response
        }catch(err: any){
            if(err instanceof HttpException){
                throw err
            }

            throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
        }
    }

    private async getCellCountAPICall(body: GetCellCountRequestDTO): Promise<GetCellCountResponseDTO>{
        try {
            const response = await this.cellCounter().post<GetCellCountResponseDTO>(``, body).then(res => {
                return GetCellCountResponseSchema.parse(res.data)
             }).catch((err: any) => {
                 if(err instanceof AxiosError){
                    throw new HttpException(err.response.data, err.response.status)
                 }
     
                 throw new HttpException(err, HttpStatus.UNPROCESSABLE_ENTITY);
             })
     
             return response
        }catch(err){
           throw err 
        }
    }
}

