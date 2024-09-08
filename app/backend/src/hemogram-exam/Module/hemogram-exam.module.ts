import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HemogramExamService } from '../Service';
import { HemogramExamController } from '../Controller';
import { HemogramExamEntity, HemogramExamDocumentEntity } from '../Entity';
import { DocumentModule } from '../../document';
import { JobModule } from '../../job';
import { IndicatorModule } from '../../indicator';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HemogramExamEntity,
      HemogramExamDocumentEntity
    ]),
    DocumentModule,
    JobModule,
    IndicatorModule,
  ],
  providers: [HemogramExamService],
  controllers: [HemogramExamController],
  exports: [HemogramExamService]
})
export class HemogramExamModule {}
