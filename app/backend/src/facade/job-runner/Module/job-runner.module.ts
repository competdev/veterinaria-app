import { Module } from '@nestjs/common';
import { JobRunnerService } from '../Service';
import { ScheduleModule } from '@nestjs/schedule';
import { JobModule } from '../../../job';
import { HemogramExamModule } from '../../../hemogram-exam';
import { DocumentModule } from '../../../document';
import { CellCounterService } from '../../../utils';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    JobModule,
    HemogramExamModule,
    DocumentModule
  ],
  providers: [JobRunnerService, CellCounterService]
})
export class JobRunnerModule {}
