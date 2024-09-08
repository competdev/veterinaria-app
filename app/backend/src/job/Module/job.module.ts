import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobService } from '../Service';
import { JobEntity } from '../Entity';
import { IndicatorModule } from '../../indicator';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobEntity]),
    IndicatorModule
  ],
  providers: [JobService],
  exports: [JobService]
})
export class JobModule {}
