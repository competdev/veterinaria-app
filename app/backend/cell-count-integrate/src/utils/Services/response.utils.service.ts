import { HttpException } from '@nestjs/common';
import { DefaultResponse } from '../DTO';
import { ResponseStatuEnum } from '../Enums';
import { ResponseStatus } from '../Types';

export const GenerateDefaultResponse = (statusCode: number, data: any, message: ResponseStatus, time: Date = new Date() ): DefaultResponse<any> => {
    const response: DefaultResponse<any> = {
        statusCode,
        message,
        data: { ...data },
        time,
    }

    return response
} 

export const GenerateDefaultErrorResponse = (statusCode: number, data: any, message: ResponseStatus = ResponseStatuEnum.ERROR, time: Date = new Date() ): HttpException => {
    const errorResponse = GenerateDefaultResponse(
        statusCode,
        data,
        message,
        time,
    )

    return new HttpException(errorResponse, statusCode)
} 