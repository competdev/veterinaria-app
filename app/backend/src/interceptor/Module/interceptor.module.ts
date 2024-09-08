import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from '../Interceptors';

@Module({
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor,
        }
    ]
})
export class InterceptorModule {}
