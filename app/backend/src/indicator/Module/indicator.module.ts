import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorEntity, IndicatorTypeEntity } from '../Entities';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            IndicatorEntity,
            IndicatorTypeEntity 
        ])
    ],
    exports: [
        TypeOrmModule.forFeature([
            IndicatorEntity
        ])
    ],
})
export class IndicatorModule {}
