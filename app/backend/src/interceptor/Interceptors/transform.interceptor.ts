import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  Observable,
  map,
  catchError,
} from 'rxjs';
import {
  GenerateDefaultErrorResponse,
  DefaultResponse,
  GenerateDefaultResponse,
  ResponseStatuEnum,
 } from '../../utils'


@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, DefaultResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<DefaultResponse<T>> {
    
    return next.handle().pipe(map(data => {
      let responseData = data;
      if(typeof responseData === 'string') {
        responseData = {
          message: data
        }
      } else if(responseData.constructor.name === 'Array') {
        responseData = {
          size: data.length,
          content: data
        }
      }
      const response = GenerateDefaultResponse(
        context.getArgs()[1].statusCode,
        {...responseData},
        ResponseStatuEnum.SUCCESS,
      )
      return response
    }), catchError((err: any) => {
        let errorData;
        if(err instanceof HttpException) {
          errorData = err.getResponse();
          if(typeof errorData === 'string') {
            errorData = {
              message: err.getResponse()
            }
          }
          const errorResponse = GenerateDefaultErrorResponse(
            err.getStatus(),
            {...errorData}
          )
          throw errorResponse
        }
        errorData = err.message;
          if(typeof errorData === 'string') {
            errorData = {
              message: err.message
            }
          }
          const errorResponse = GenerateDefaultErrorResponse(
            HttpStatus.BAD_REQUEST,
            {...errorData}
          )
          throw errorResponse
    }));
  }
}
